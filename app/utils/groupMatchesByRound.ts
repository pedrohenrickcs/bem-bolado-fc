import type { Match, MatchesByRound } from "~/types.ts/MatchesByRound";

export default function groupMatchesByRound(matches: Match[]): MatchesByRound {
  return matches.reduce<MatchesByRound>((acc, match) => {
    const round = match.round ?? 0;
    if (!acc[round]) acc[round] = [];
    acc[round].push(match);
    return acc;
  }, {});
}