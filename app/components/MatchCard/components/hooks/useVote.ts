import { useQueryClient } from "@tanstack/react-query";
import { deleteField, doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { db } from "~/lib/firebase";

export function useVote(matchId: string, userId: string) {
  const [isVoting, setIsVoting] = useState(false);
  const queryClient = useQueryClient();

  async function vote(vote: string) {
    setIsVoting(true);
    try {
      await updateDoc(doc(db, "matches", matchId), {
        [`votes.${userId}`]: vote,
      });

      // 👉 força o refetch da lista de partidas
      queryClient.invalidateQueries({ queryKey: ["matches"] });
    } finally {
      setIsVoting(false);
    }
  }

  async function resetVote() {
    setIsVoting(true);
    try {
      await updateDoc(doc(db, "matches", matchId), {
        [`votes.${userId}`]: deleteField(),
      });

      queryClient.invalidateQueries({ queryKey: ["matches"] });
    } finally {
      setIsVoting(false);
    }
  }

  return { isVoting, vote, resetVote };
}
