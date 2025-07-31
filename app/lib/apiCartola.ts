export async function getCartolaMatches(round: number = 1) {
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
      championship: "Brasileirão",
      votes: {}, 
    };
  });

  return matchesFormatted;
}
