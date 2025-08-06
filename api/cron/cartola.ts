export const config = {
  runtime: "edge", 
};

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const pathname = url.pathname.replace("/api/cartola", ""); 

  try {
    const response = await fetch(`https://api.cartola.globo.com${pathname}`);

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Erro ao buscar dados" }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}
