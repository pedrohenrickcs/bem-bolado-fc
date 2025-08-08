import { Button } from "~/components/ui/button";
import type { Match } from "~/types.ts/MatchesByRound";
import type { Vote } from "~/types.ts/Vote";
import { useVote } from "./hooks/useVote";

type Props = {
  match: Match;
  userId: string;
  currentVote?: Vote;
  isClosed: boolean;
};

export function VoteActions({ match, userId, currentVote, isClosed }: Props) {
  const { isVoting, vote, resetVote } = useVote(match.id, userId);

  const voteLabels: Record<Vote, string> = {
    HOME: match.home_team,
    DRAW: "Empate",
    AWAY: match.away_team,
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-2 mt-2">
        {(["HOME", "DRAW", "AWAY"] as Vote[]).map((v) => (
          <Button
            key={v}
            variant={currentVote === v ? "default" : "outline"}
            size="sm"
            disabled={isVoting || isClosed}
            onClick={() => vote(v)}
            className="text-xs py-2 cursor-pointer"
          >
            {voteLabels[v]}
          </Button>
        ))}
      </div>

      <div className="mt-2 h-9">
        {currentVote && (
          <Button
            onClick={resetVote}
            disabled={isVoting || isClosed}
            className="text-xs py-2 w-full bg-red-100 text-red-700 hover:bg-red-200 cursor-pointer"
          >
            Cancelar voto
          </Button>
        )}
      </div>
    </>
  );
}
