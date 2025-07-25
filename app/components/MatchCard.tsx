import { doc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

type Vote = "HOME" | "DRAW" | "AWAY";

type Match = {
  id: string;
  home_team: string;
  away_team: string;
  date: any; // Timestamp | string
  votes?: Record<string, Vote>;
};

export function MatchCard({ match, userId }: { match: Match; userId: string }) {
  const userVote = match.votes?.[userId];
  const { majority, count, total, tally } = computeMajority(match.votes ?? {});
  const isClosed = new Date(match.date).getTime() <= Date.now();

  const voteLabels: Record<Vote, string> = {
    HOME: "Casa",
    DRAW: "Empate",
    AWAY: "Visitante",
  };

  async function handleVote(vote: Vote) {
    if (isClosed) return;
    const ref = doc(db, "matches", match.id);
    await updateDoc(ref, {
      [`votes.${userId}`]: vote,
    });
  }

  return (
    <div className="bg-white rounded shadow p-4 space-y-2">
      <p className="font-medium">
        {match.home_team} vs {match.away_team}
      </p>

      <p className="text-xs text-gray-500">
        Data: {new Date(match.date).toLocaleString()}
      </p>

      {isClosed && (
        <span className="inline-block text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
          Votação encerrada
        </span>
      )}

      <div className="flex gap-2 mt-2">
        {(["HOME", "DRAW", "AWAY"] as Vote[]).map((v) => (
          <button
            key={v}
            disabled={isClosed}
            onClick={() => handleVote(v)}
            className={[
              "px-3 py-1 rounded border",
              userVote === v
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-800",
              isClosed ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50",
            ].join(" ")}
          >
            {voteLabels[v]}
          </button>
        ))}
      </div>

      <div className="text-sm mt-2">
        <p>
          <span className="font-semibold">Seu voto:</span>{" "}
          {userVote ? voteLabels[userVote] : "—"}
        </p>
        <p>
          <span className="font-semibold">Voto coletivo:</span>{" "}
          {total > 0 ? `${voteLabels[majority]} (${count}/${total})` : "—"}
        </p>
        {total > 0 && (
          <p className="text-xs text-gray-500">
            Parcial — Casa: {tally.HOME} • Empate: {tally.DRAW} • Visitante:{" "}
            {tally.AWAY}
          </p>
        )}
      </div>
    </div>
  );
}

function computeMajority(votes: Record<string, Vote>) {
  const tally: Record<Vote, number> = { HOME: 0, DRAW: 0, AWAY: 0 };
  Object.values(votes).forEach((v) => (tally[v] = (tally[v] || 0) + 1));

  const entries = Object.entries(tally) as Array<[Vote, number]>;
  const [majority, count] = entries.sort((a, b) => b[1] - a[1])[0];
  const total = Object.values(tally).reduce((s, n) => s + n, 0);

  return { majority, count, total, tally };
}
