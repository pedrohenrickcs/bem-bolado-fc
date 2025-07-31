import { doc, setDoc } from "firebase/firestore";
import { getCartolaMatches } from "./apiCartola";
import { db } from "./firebase";

export async function syncCartolaToFirestore(rodada: number = 19) {
  const getMatches = await getCartolaMatches(rodada);

  for (const match of getMatches) {
    const ref = doc(db, "matches", match.id);
    await setDoc(ref, {
      ...match,
      votes: {}, 
    });
  }

  console.log("Partidas sincronizadas com Firestore.");
}
