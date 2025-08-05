import type { VercelRequest, VercelResponse } from "@vercel/node";
import { syncMultipleRounds } from "~/lib/syncCartolaToFirestore";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  try {
    await syncMultipleRounds(18, 21);
    return res.status(200).json({ message: "Sync concluído com sucesso!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro na sincronização" });
  }
}
