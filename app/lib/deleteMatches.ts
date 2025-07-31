import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export async function deleteAllMatches() {
  const matchesRef = collection(db, "matches");
  const snapshot = await getDocs(matchesRef);

  const deletions = snapshot.docs.map((docSnap) =>
    deleteDoc(doc(db, "matches", docSnap.id))
  );

  await Promise.all(deletions);
  console.log("🔥 Todos os documentos da coleção 'matches' foram deletados.");
}
