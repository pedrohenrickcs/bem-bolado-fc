import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export async function seedMockMatches() {
   const matches = [
    {
      id: "match_001",
      home_team: "Grêmio",
      away_team: "Fortaleza",
      date: "2025-07-26T16:00:00",
      championship: "Brasileirão",
    },
    {
      id: "match_002",
      home_team: "Sport recife",
      away_team: "Bahia",
      date: "2025-07-26T18:00:00",
      championship: "Brasileirão",
    },
    {
      id: "match_003",
      home_team: "Mirassol",
      away_team: "Vasco da Gama",
      date: "2025-07-26T20:00:00",
      championship: "Brasileirão",
    },
    {
      id: "match_004",
      home_team: "Fluminense",
      away_team: "Grêmio",
      date: "2025-07-26T19:00:00",
      championship: "Brasileirão",
    },
    {
      id: "match_005",
      home_team: "Corinthians",
      away_team: "Fortaleza",
      date: "2025-07-27T17:00:00",
      championship: "Brasileirão",
    },
    {
      id: "match_006",
      home_team: "Botafogo",
      away_team: "Cruzeiro",
      date: "2025-07-27T17:00:00",
      championship: "Brasileirão",
    },
    {
      id: "match_007",
      home_team: "Ceará",
      away_team: "Flamengo",
      date: "2025-07-27T17:00:00",
      championship: "Brasileirão",
    },
    {
      id: "match_008",
      home_team: "Atlético Mineiro",
      away_team: "Bragantino",
      date: "2025-07-27T17:00:00",
      championship: "Brasileirão",
    },
    {
      id: "match_009",
      home_team: "Vitória",
      away_team: "Palmeiras",
      date: "2025-07-27T17:00:00",
      championship: "Brasileirão",
    },
    {
      id: "match_010",
      home_team: "Internacional",
      away_team: "São Paulo",
      date: "2025-07-27T17:00:00",
      championship: "Brasileirão",
    },
    {
      id: "match_011",
      home_team: "Santos",
      away_team: "Juventude",
      date: "2025-07-27T17:00:00",
      championship: "Brasileirão",
    },
  ];

  for (const match of matches) {
    await setDoc(doc(db, 'matches', match.id), {
      ...match,
      votes: {},
    })
  }

  console.log('Mock matches seeded.')
}
