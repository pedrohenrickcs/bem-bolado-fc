import type { Vote } from "./Vote";

export interface Match {
  id: string;
  round: number;
  home_team: string;
  away_team: string;
  home_logo?: string;
  away_logo?: string;
  date: string;
  local?: string;
  championship?: string;
  votes?: Record<string, Vote>;
}

export type MatchesByRound = Record<number, Match[]>;