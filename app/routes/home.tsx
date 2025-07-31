import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Footer } from "~/components/Footer";
import { Header } from "~/components/Header";
import { Login } from "~/components/Login";
import { MatchCard } from "~/components/MatchCard";
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
    const unsubscribe = onSnapshot(collection(db, "matches"), (snapshot) => {
      const dataMatches = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log("dataMatches", dataMatches);
      setMatches(dataMatches);
    });

    return () => unsubscribe();
  }, []);

  if (!user) return <Login />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-yellow-50 to-blue-50">
      <Header
        user={{
          name: user.displayName,
          email: user.email,
        }}
        onLogout={() => signOut(auth)}
      />

      <div className="p-4 mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto mb-16">
        {matches.map((m) => (
          <MatchCard key={m.id} match={m} userId={user.uid} />
        ))}
      </div>

      <Footer />
    </div>
  );
}
