import type { Vote } from "~/types.ts/Vote";


export default function getTopVote(
  votes: Record<string, Vote>
): { vote: Vote; percentage: number } | null {
  const tally: Record<Vote, number> = { HOME: 0, DRAW: 0, AWAY: 0 };

  for (const vote of Object.values(votes)) {
    tally[vote]++;
  }

  const total = Object.values(tally).reduce((acc, count) => acc + count, 0);
  if (total === 0) return null;

  const [topVote, count] = Object.entries(tally).reduce(([v1, c1], [v2, c2]) =>
    c2 > c1 ? [v2, c2] : [v1, c1]
  ) as [Vote, number];

  const percentage = Math.round((count / total) * 100);
  return { vote: topVote, percentage };
}
