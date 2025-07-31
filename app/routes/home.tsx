import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Footer } from "~/components/Footer";
import { Header } from "~/components/Header";
import { Login } from "~/components/Login";
import { MatchCard } from "~/components/MatchCard";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { auth, db } from "~/lib/firebase";

type Match = {
  id: string;
  round: number;
  home_team: string;
  away_team: string;
  home_logo?: string;
  away_logo?: string;
  date: string;
  local?: string;
  championship?: string;
  votes?: Record<string, "HOME" | "DRAW" | "AWAY">;
};

type MatchesByRound = Record<number, Match[]>;

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [matchesByRound, setMatchesByRound] = useState({});
  const [selectedRound, setSelectedRound] = useState(18);
  const [authLoading, setAuthLoading] = useState(true);
  //   const [showVotes, setShowVotes] = useState(false);
  const [showPopularVotes, setShowPopularVotes] = useState(false);

  //   useEffect(() => {
  //     import("~/lib/syncCartolaToFirestore").then(({ syncMultipleRounds }) => {
  //       syncMultipleRounds(18, 21);
  //     });
  //   }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "matches"), (snapshot) => {
      const partidas = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Match[];

      const grouped: MatchesByRound = {};

      for (const partida of partidas) {
        const round = partida.round ?? 0;
        if (!grouped[round]) grouped[round] = [];
        grouped[round].push(partida);
      }

      setMatchesByRound(grouped);
    });

    return () => unsubscribe();
  }, []);

  const rounds = useMemo(() => {
    return Object.keys(matchesByRound)
      .map(Number)
      .sort((a, b) => a - b);
  }, [matchesByRound]);

  const minRound = rounds[0] ?? 18;
  const maxRound = rounds[rounds.length - 1] ?? 38;

  useEffect(() => {
    if (rounds.length > 0 && !selectedRound) {
      setSelectedRound(rounds[0]);
    }
  }, [rounds, selectedRound]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Verificando autenticação...
          </p>
        </div>
      </div>
    );
  }

  if (!user) return <Login />;

  return (
    <div className="flex flex-col justify-between min-h-screen bg-gradient-to-br from-emerald-50 via-yellow-50 to-blue-50">
      <Header
        user={{
          name: user.displayName,
          email: user.email,
        }}
        onLogout={() => signOut(auth)}
      />

      <Button
        onClick={() => setShowPopularVotes(true)}
        variant="outline"
        className="fixed bottom-6 right-6 z-50 shadow-md cursor-pointer"
      >
        🔥 Palpites da Galera
      </Button>

      <div className="flex items-center text-center flex-col justify-center gap-4 pt-22 pb-6">
        <div>
          <span className="text-lg font-bold text-gray-600">
            Jogos da Rodada {selectedRound}
          </span>
          <p className="text-xs">
            Vote nos resultados e ajude a definir as apostas do grupo!
          </p>
        </div>

        <div className="gap-4 flex mx-3">
          <button
            onClick={() =>
              setSelectedRound((prev) =>
                Math.max((prev ?? minRound) - 1, minRound)
              )
            }
            disabled={selectedRound === minRound}
            className="px-4 py-2 bg-primary text-sm text-white rounded disabled:opacity-50 cursor-pointer"
          >
            ← Rodada Anterior
          </button>

          <button
            onClick={() =>
              setSelectedRound((prev) =>
                Math.min((prev ?? minRound) + 1, maxRound)
              )
            }
            disabled={selectedRound === maxRound}
            className="px-4 py-2 bg-primary text-sm text-white rounded disabled:opacity-50 cursor-pointer"
          >
            Próxima Rodada →
          </button>
        </div>
      </div>

      {matchesByRound[selectedRound as keyof typeof matchesByRound] ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto px-4 mb-16">
          {(
            matchesByRound[
              selectedRound as keyof typeof matchesByRound
            ] as Array<any>
          ).map((m: any) => (
            <MatchCard key={m.id} match={m} userId={user.uid} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground mt-8">
          Nenhuma partida disponível para a rodada {selectedRound}.
        </p>
      )}

      <Dialog open={showPopularVotes} onOpenChange={setShowPopularVotes}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Palpites da Galera</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {Object.entries(matchesByRound)
              .sort(([a], [b]) => Number(b) - Number(a))
              .map(([round, matches]) => {
                const jogosComVotos = matches.filter(
                  (m) => Object.keys(m.votes || {}).length > 0
                );
                if (jogosComVotos.length === 0) return null;

                return (
                  <div key={round}>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                      Rodada {round}
                    </h3>
                    <ul className="space-y-2">
                      {jogosComVotos.map((m) => {
                        const top = getTopVote(m.votes || {});
                        if (!top) return null;

                        const nomeVencedor =
                          top.vote === "HOME"
                            ? m.home_team
                            : top.vote === "AWAY"
                              ? m.away_team
                              : "Empate";

                        return (
                          <li
                            key={m.id}
                            className="bg-muted px-4 py-2 rounded flex justify-between items-center"
                          >
                            <span className="text-sm">
                              {m.home_team} vs {m.away_team}
                            </span>
                            <span className="text-xs text-primary font-medium">
                              🗳️ {nomeVencedor} ({top.percentage}%)
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}

type Vote = "HOME" | "DRAW" | "AWAY";

function getTopVote(
  votes: Record<string, Vote>
): { vote: Vote; percentage: number } | null {
  const tally: Record<Vote, number> = { HOME: 0, DRAW: 0, AWAY: 0 };

  Object.values(votes).forEach((v) => {
    if (v === "HOME" || v === "DRAW" || v === "AWAY") tally[v]++;
  });

  const total = Object.values(tally).reduce((acc, val) => acc + val, 0);
  if (total === 0) return null;

  const voteEntries = Object.entries(tally) as [Vote, number][];
  const [topVote, count] = voteEntries.reduce((a, b) => (a[1] > b[1] ? a : b));

  const percentage = Math.round((count / total) * 100);
  return { vote: topVote, percentage };
}
