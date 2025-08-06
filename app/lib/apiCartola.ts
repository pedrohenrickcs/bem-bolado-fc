const apiCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

const API_URL = import.meta.env.VITE_API_URL || "https://api.cartola.globo.com";

export async function getCartolaMatches(round: number = 1) {
  const cacheKey = `matches_${round}`;
  const cached = apiCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  const res = await fetch(`/api-cartola/partidas/${round}`);
  const data = await res.json();

  const partidas = data.partidas;
  const clubes = data.clubes;

  const matchesFormatted = partidas.map((partida: any) => {
    const homeClub = clubes[partida.clube_casa_id];
    const awayClub = clubes[partida.clube_visitante_id];

    return {
      id: `match_${partida.partida_id}`,
      round,
      home_team: homeClub.nome_fantasia || homeClub.nome,
      away_team: awayClub.nome_fantasia || awayClub.nome,
      home_logo: homeClub.escudos["60x60"],
      away_logo: awayClub.escudos["60x60"],
      date: partida.partida_data,
      local: partida.local,
      surname_away: awayClub.apelido || '',
      surname_home: homeClub.apelido || '',
      championship: "Brasileirão",
      placar_oficial_mandante: partida.placar_oficial_mandante,
      placar_oficial_visitante: partida.placar_oficial_visitante,
      status_cronometro_tr: partida.status_cronometro_tr,
      status_transmissao_tr: partida.status_transmissao_tr,
      periodo_tr: partida.periodo_tr,
      inicio_cronometro_tr: partida.inicio_cronometro_tr,
      confronto_mandante: partida.aproveitamento_mandante || [],
      confronto_visitante: partida.aproveitamento_visitante || [],
    };
  });

  apiCache.set(cacheKey, {
    data: matchesFormatted,
    timestamp: Date.now()
  });

  return matchesFormatted;
}

export async function getAllCartolaMatches(start = 1, end = 38) {
  const roundsToFetch = Array.from({ length: end - start + 1 }, (_, i) => i + start);
  const all = await Promise.all(roundsToFetch.map(getCartolaMatches));
  return all.flat();
}
