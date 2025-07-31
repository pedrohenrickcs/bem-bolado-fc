import type { Vote } from "~/types.ts/Vote";

export function computeVotes(votes: Record<string, Vote>) {
  const tally: Record<Vote, number> = { HOME: 0, DRAW: 0, AWAY: 0 };
  Object.values(votes).forEach((v) => {
    tally[v]++;
  });
  const total = Object.values(tally).reduce((sum, val) => sum + val, 0);
  return { tally, total };
}

export function getPercentages(tally: Record<Vote, number>) {
  const total = Object.values(tally).reduce((s, n) => s + n, 0);
  return {
    HOME: total ? Math.round((tally.HOME / total) * 100) : 0,
    DRAW: total ? Math.round((tally.DRAW / total) * 100) : 0,
    AWAY: total ? Math.round((tally.AWAY / total) * 100) : 0,
  };
}
