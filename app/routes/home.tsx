import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { LoginButton } from "~/components/LoginButton";
import { MatchCard } from "~/components/Matchcard";
import { auth, db } from "~/lib/firebase";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "matches"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMatches(data);
    });

    return () => unsub();
  }, []);

  const handleVote = async (matchId: string, vote: string) => {
    if (!user) return;
    const matchRef = doc(db, "matches", matchId);
    await updateDoc(matchRef, {
      [`votes.${user.uid}`]: vote,
    });
    alert(`Voto registrado: ${vote}`);
  };

  if (!user) return <LoginButton />;

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4">
      <h1 className="text-xl font-bold mb-4">Bem-vindo, {user.displayName}</h1>

      {matches.map((m) => (
        <MatchCard key={m.id} match={m} userId={user.uid} />
      ))}
    </div>
  );
}
