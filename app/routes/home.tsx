import { useQuery } from "@tanstack/react-query";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";

import { Footer } from "~/components/Footer";
import FullScreenLoader from "~/components/FullScreenLoader";
import { Header } from "~/components/Header";
import { Login } from "~/components/Login";
import { MatchCard } from "~/components/MatchCard";
import PopularVotesDialog from "~/components/PopularVotesDialog";
import { Button } from "~/components/ui/button";
import { auth, db } from "~/lib/firebase";
import type { Match, MatchesByRound } from "~/types.ts/MatchesByRound";
import groupMatchesByRound from "~/utils/groupMatchesByRound";

const fetchMatches = async () => {
  const snapshot = await getDocs(collection(db, "matches"));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Match[];
};

export default function Home() {
  const [user, setUser] = useState<null | {
    uid: string;
    email: string;
    displayName: string;
  }>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [syncLoading, setSyncLoading] = useState(false);
  const [selectedRound, setSelectedRound] = useState<number>(18);
  const [showPopularVotes, setShowPopularVotes] = useState(false);

  useEffect(() => {
    async function checkAndSync() {
      try {
        setSyncLoading(true);
        const { syncMultipleRounds } = await import(
          "~/lib/syncCartolaToFirestore"
        );

        syncMultipleRounds(18, 21)
          .then(() => {
            setSyncLoading(false);
          })
          .catch((error) => {
            console.error("Erro na sincronização:", error);
            setSyncLoading(false);
          });
      } catch (error) {
        console.error("Erro ao verificar partidas:", error);
      }
    }

    checkAndSync();
  }, []);

  useEffect(() => {
    return onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const { uid, email, displayName } = currentUser;
        setUser({ uid, email: email ?? "", displayName: displayName ?? "" });

        const { saveUserToFirestore } = await import(
          "~/lib/saveUserToFirestore"
        );
        await saveUserToFirestore(currentUser);
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });
  }, []);

  const { data: matches } = useQuery({
    queryKey: ["matches"],
    queryFn: fetchMatches,
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000,
  });

  useEffect(() => {
    const sync = async () => {
      if (!matches || matches.length === 0) {
        setSyncLoading(true);
        const { syncMultipleRounds } = await import(
          "~/lib/syncCartolaToFirestore"
        );

        syncMultipleRounds(18, 21)
          .then(() => setSyncLoading(false))
          .catch((error) => {
            console.error("Erro na sincronização:", error);
            setSyncLoading(false);
          });
      }
    };
    sync();
  }, [matches]);

  const matchesByRound: MatchesByRound = useMemo(() => {
    return groupMatchesByRound(matches ?? []);
  }, [matches]);

  const rounds = useMemo(() => {
    return Object.keys(matchesByRound)
      .map(Number)
      .sort((a, b) => a - b);
  }, [matchesByRound]);

  const minRound = rounds[0] ?? 18;
  const maxRound = rounds[rounds.length - 1] ?? 38;

  useEffect(() => {
    if (!selectedRound && rounds.length > 0) {
      setSelectedRound(rounds[0]);
    }
  }, [rounds, selectedRound]);

  if (authLoading) {
    return <FullScreenLoader message="Verificando autenticação..." />;
  }

  if (!user) return <Login />;

  const currentMatches = matchesByRound[selectedRound] || [];

  return (
    <div className="flex flex-col justify-between min-h-screen bg-gradient-to-br from-emerald-50 via-yellow-50 to-blue-50">
      <Header
        user={{ name: user.displayName, email: user.email }}
        onLogout={() => signOut(auth)}
      />

      {syncLoading && (
        <div className="fixed top-0 left-0 right-0 bg-blue-500 text-white text-center py-2 z-50">
          🔄 Sincronizando dados das partidas...
        </div>
      )}

      <Button
        onClick={() => setShowPopularVotes(true)}
        variant="outline"
        className="fixed bottom-6 right-6 z-50 shadow-md cursor-pointer"
      >
        🔥 Palpites da Galera
      </Button>

      <div className="flex items-center flex-col text-center gap-4 pt-22 pb-6">
        <div>
          <span className="text-lg font-bold text-gray-600">
            Jogos da Rodada {selectedRound}
          </span>
          <p className="text-xs">
            Vote nos resultados e ajude a definir as apostas do grupo!
          </p>
        </div>

        <div className="gap-4 flex mx-3">
          <Button
            disabled={selectedRound === minRound}
            onClick={() => setSelectedRound((r) => Math.max(r - 1, minRound))}
            className="cursor-pointer"
          >
            ← Rodada Anterior
          </Button>
          <Button
            disabled={selectedRound === maxRound}
            onClick={() => setSelectedRound((r) => Math.min(r + 1, maxRound))}
            className="cursor-pointer"
          >
            Próxima Rodada →
          </Button>
        </div>
      </div>

      {currentMatches.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto px-4 mb-16">
          {currentMatches.map((match) => (
            <MatchCard key={match.id} match={match} userId={user.uid} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground mt-8">
          Nenhuma partida disponível para a rodada {selectedRound}.
        </p>
      )}

      <PopularVotesDialog
        open={showPopularVotes}
        onOpenChange={setShowPopularVotes}
        matchesByRound={matchesByRound}
      />

      <Footer />
    </div>
  );
}
