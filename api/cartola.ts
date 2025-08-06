import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { url } = req;
  const path = url?.replace("/api/cartola", "") ?? "";

  try {
    const response = await fetch(`https://api.cartola.globo.com${path}`);
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Erro na Cartola API" });
  }
}
