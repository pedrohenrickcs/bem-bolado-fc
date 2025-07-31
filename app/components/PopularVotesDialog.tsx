import type { MatchesByRound } from "~/types.ts/MatchesByRound";
import getTopVote from "~/utils/getTopVotes";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

export default function PopularVotesDialog({
  open,
  onOpenChange,
  matchesByRound,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  matchesByRound: MatchesByRound;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Palpites da Galera</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {Object.entries(matchesByRound)
            .sort(([a], [b]) => Number(b) - Number(a))
            .map(([round, matches]) => {
              const votedMatches = matches.filter(
                (m) => Object.keys(m.votes ?? {}).length > 0
              );

              if (votedMatches.length === 0) return null;

              return (
                <div key={round}>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                    Rodada {round}
                  </h3>
                  <ul className="space-y-2">
                    {votedMatches.map((match) => {
                      const top = getTopVote(match.votes ?? {});
                      if (!top) return null;

                      const winner =
                        top.vote === "HOME"
                          ? match.home_team
                          : top.vote === "AWAY"
                            ? match.away_team
                            : "Empate";

                      return (
                        <li
                          key={match.id}
                          className="bg-muted px-4 py-2 rounded flex justify-between items-center"
                        >
                          <span className="text-sm">
                            {match.home_team} vs {match.away_team}
                          </span>
                          <span className="text-xs text-primary font-medium">
                            🗳️ {winner} ({top.percentage}%)
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
  );
}
