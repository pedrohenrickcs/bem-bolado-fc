export const config = {
  runtime: "edge",
};

export default async function handler(req: Request) {
  const { pathname } = new URL(req.url);
  const targetPath = pathname.replace("/api/cartola", "");

  const cartolaUrl = `https://api.cartola.globo.com${targetPath}`;

  try {
    const response = await fetch(cartolaUrl);
    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Erro na Cartola API" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
