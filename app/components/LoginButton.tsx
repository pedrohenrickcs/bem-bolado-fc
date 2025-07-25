import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "~/lib/firebase";

export function LoginButton() {
  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      alert(`Bem-vindo, ${user.displayName}!`);
    } catch (err) {
      console.error("Erro ao fazer login:", err);
    }
  };

  return (
    <button
      onClick={handleLogin}
      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
    >
      Entrar com Google
    </button>
  );
}
