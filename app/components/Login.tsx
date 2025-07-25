import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "~/lib/firebase";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
// import { FcGoogle } from "react-icons/fc";

export function Login() {
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-200 via-yellow-100 to-blue-100 animate-fade-in">
      <Card className="w-full max-w-sm shadow-xl border border-border m-4">
        <CardHeader>
          <CardTitle className="text-xl text-center font-bold text-primary">
            Bem-vindo ao ⚽ Bolado FC
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 items-center">
          <p className="text-sm text-muted-foreground text-center">
            Faça login para entrar no bolão com a galera!
          </p>

          <Button
            onClick={handleLogin}
            variant="outline"
            className="w-full flex items-center justify-center gap-2 hover:bg-muted transition-all"
          >
            {/* <FcGoogle className="text-lg" /> */}
            Entrar com Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
