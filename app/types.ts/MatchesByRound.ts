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
  placar_oficial_mandante?: number | null
  placar_oficial_visitante?: number | null
  status_cronometro_tr?: string | number | null
  status_transmissao_tr?: string
  periodo_tr?: number | string
  surname_away?: string | null
  surname_home?: string | null
  
}

export type MatchesByRound = Record<number, Match[]>;