import { doc, setDoc } from "firebase/firestore";
import { getCartolaMatches } from "./apiCartola";
import { db } from "./firebase";

export async function syncMultipleRounds(start: number, end: number) {
  for (let round = start; round <= end; round++) {
    const partidas = await getCartolaMatches(round);

    for (const partida of partidas) {
      const ref = doc(db, "matches", partida.id);
      await setDoc(ref, {
        ...partida,
        round,
        votes: {},
      });
    }

    console.log(`Rodada ${round} sincronizada`);
  }

  console.log("Todas as rodadas sincronizadas!");
}
