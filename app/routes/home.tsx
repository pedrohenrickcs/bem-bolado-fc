import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { Footer } from "~/components/Footer";
import { Header } from "~/components/Header";
import { Login } from "~/components/Login";
import { MatchCard } from "~/components/MatchCard";
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

  //   useEffect(() => {
  //     import("~/lib/syncCartolaToFirestore").then(({ syncMultipleRounds }) => {
  //       syncMultipleRounds(18, 21);
  //     });
  //   }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
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

      <div className="flex items-center flex-col justify-center gap-4 pt-20 pb-6">
        <div>
          <span className="text-lg font-bold text-gray-600">
            Jogos da Rodada {selectedRound}
          </span>
        </div>

        <div className="gap-4 flex">
          <button
            onClick={() =>
              setSelectedRound((prev) =>
                Math.max((prev ?? minRound) - 1, minRound)
              )
            }
            disabled={selectedRound === minRound}
            className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50 cursor-pointer"
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
            className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50 cursor-pointer"
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

      <Footer />
    </div>
  );
}
