import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export async function seedMockMatches() {
   const matches = [
    {
      id: "match_001",
      home_team: "Botafogo",
      away_team: "Corinthians",
      date: "2025-07-26T16:00:00",
      championship: "Brasileirão",
    },
    {
      id: "match_002",
      home_team: "Mirassol",
      away_team: "Vitória",
      date: "2025-07-26T18:00:00",
      championship: "Brasileirão",
    },
    {
      id: "match_003",
      home_team: "Fortaleza",
      away_team: "Bragantino",
      date: "2025-07-26T20:00:00",
      championship: "Brasileirão",
    },
    {
      id: "match_004",
      home_team: "Palmeiras",
      away_team: "Grêmio",
      date: "2025-07-26T19:00:00",
      championship: "Brasileirão",
    },
    {
      id: "match_005",
      home_team: "São Paulo",
      away_team: "Fluminense",
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
