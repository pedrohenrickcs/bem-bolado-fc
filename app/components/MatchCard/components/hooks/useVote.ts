import { deleteField, doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { db } from "~/lib/firebase";

export function useVote(matchId: string, userId: string) {
  const [isVoting, setIsVoting] = useState(false);

  async function vote(vote: string) {
    setIsVoting(true);
    try {
      await updateDoc(doc(db, "matches", matchId), {
        [`votes.${userId}`]: vote,
      });
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
    } finally {
      setIsVoting(false);
    }
  }

  return { isVoting, vote, resetVote };
}
