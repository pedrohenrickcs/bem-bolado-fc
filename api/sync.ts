import { syncMultipleRounds } from "~/lib/syncCartolaToFirestore";

export default async function handler(req: Request): Promise<Response> {
  try {
    console.log("Iniciando sincronização via Vercel cron...");
    await syncMultipleRounds(18, 21); 
    return new Response("Sincronizado com sucesso ✅", { status: 200 });
  } catch (error) {
    console.error("Erro na sincronização:", error);
    return new Response("Erro ao sincronizar ❌", { status: 500 });
  }
}
