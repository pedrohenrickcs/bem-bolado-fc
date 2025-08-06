export default async function handler(req, res) {
  const path = req.url?.replace("/api/cartola", "") ?? "";

  try {
    const response = await fetch(`https://api.cartola.globo.com${path}`);
    const data = await response.json();
    res.setHeader("Content-Type", "application/json");
    res.status(200).end(JSON.stringify(data));
  } catch (err) {
    res.status(500).json({ error: "Erro na Cartola API" });
  }
}
