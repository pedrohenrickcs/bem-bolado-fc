import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "~/lib/firebase";
import type { Match } from "~/types.ts/MatchesByRound";
import type { Vote } from "~/types.ts/Vote";

interface PlayerStats {
  uid: string;
  name: string;
  totalVotos: number;
  acertos: number;
  erros: number;
  empates: number;
  tendencia: Vote;
  percentualAcerto: number;
}

function getResultadoReal(match: Match): Vote | null {
  if (
    match.placar_oficial_mandante === null ||
    match.placar_oficial_mandante === undefined ||
    match.placar_oficial_visitante === null ||
    match.placar_oficial_visitante === undefined
  )
    return null;

  if (match.placar_oficial_mandante > match.placar_oficial_visitante)
    return "HOME";
  if (match.placar_oficial_mandante < match.placar_oficial_visitante)
    return "AWAY";
  return "DRAW";
}

function gerarEstatisticas(matches: Match[]): PlayerStats[] {
  const stats: Record<string, PlayerStats> = {};

  for (const match of matches) {
    const resultado = getResultadoReal(match);
    if (!resultado) continue;

    for (const [uid, voto] of Object.entries(match.votes || {})) {
      if (!stats[uid]) {
        stats[uid] = {
          uid,
          name: `User ${uid.slice(-4)}`,
          totalVotos: 0,
          acertos: 0,
          erros: 0,
          empates: 0,
          tendencia: voto,
          percentualAcerto: 0,
        };
      }

      const s = stats[uid];
      s.totalVotos++;
      if (voto === resultado) {
        s.acertos++;
      } else {
        s.erros++;
      }
      if (voto === "DRAW") s.empates++;
    }
  }

  for (const stat of Object.values(stats)) {
    stat.percentualAcerto = Math.round((stat.acertos / stat.totalVotos) * 100);
  }

  return Object.values(stats);
}

function getTag(player: PlayerStats): string | null {
  if (player.acertos === 0 && player.totalVotos >= 3) return "💩 Errou Tudo";
  if (player.percentualAcerto >= 80) return "🎯 Palpiteiro Certeiro";
  if (player.percentualAcerto <= 25 && player.totalVotos >= 3)
    return "🧊 Mais Pé Frio";
  if (player.empates >= player.totalVotos * 0.5) return "🐔 Em Cima do Muro";
  if (player.totalVotos <= 2) return "🫥 Sumido";
  return null;
}

export default function Leaderboard() {
  const [ranking, setRanking] = useState<PlayerStats[]>([]);

  useEffect(() => {
    async function fetchMatches() {
      const snapshot = await getDocs(collection(db, "matches"));
      const matches = snapshot.docs.map((doc) => doc.data() as Match);
      const stats = gerarEstatisticas(matches);
      setRanking(stats.sort((a, b) => b.percentualAcerto - a.percentualAcerto));
    }

    fetchMatches();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">
        🏆 Ranking Bem Bolado FC
      </h1>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full border border-border text-sm">
          <thead className="bg-muted text-xs uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Jogador</th>
              <th className="px-4 py-3 text-center">🎯 Acertos</th>
              <th className="px-4 py-3 text-center">❌ Erros</th>
              <th className="px-4 py-3 text-center">% Acerto</th>
              <th className="px-4 py-3 text-left">🔥 Destaque</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((player, i) => (
              <tr key={player.uid} className="even:bg-muted/30">
                <td className="px-4 py-2 font-bold">{i + 1}</td>
                <td className="px-4 py-2">{player.name}</td>
                <td className="px-4 py-2 text-center">{player.acertos}</td>
                <td className="px-4 py-2 text-center">{player.erros}</td>
                <td className="px-4 py-2 text-center">
                  {player.percentualAcerto}%
                </td>
                <td className="px-4 py-2">
                  {getTag(player) ? (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      {getTag(player)}
                    </span>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
