import { doc, setDoc } from 'firebase/firestore'
import { db } from './firebase'

export async function seedMockMatches() {
  const matches = [
    {
      id: 'match_001',
      home_team: 'Palmeiras',
      away_team: 'Corinthians',
      date: '2025-07-28T16:00:00',
    },
    {
      id: 'match_002',
      home_team: 'Flamengo',
      away_team: 'Vasco',
      date: '2025-07-28T18:00:00',
    },
  ]

  for (const match of matches) {
    await setDoc(doc(db, 'matches', match.id), {
      ...match,
      votes: {},
    })
  }

  console.log('Mock matches seeded.')
}
