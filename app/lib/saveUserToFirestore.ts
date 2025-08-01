import { doc, setDoc } from "firebase/firestore";
import { db } from "~/lib/firebase";

export async function saveUserToFirestore(user: {
  uid: string;
  displayName: string | null;
  email: string | null;
}) {
  const ref = doc(db, "users", user.uid);
  await setDoc(ref, {
    name: user.displayName ?? "Anônimo",
    email: user.email ?? "",
  }, { merge: true });
}
