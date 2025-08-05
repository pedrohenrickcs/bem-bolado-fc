export const config = {
  runtime: "edge", // ou "node" se preferir
};

export default async function handler(req: Request) {
  if (req.method !== "GET") {
    return new Response("Método não permitido", { status: 405 });
  }

  try {
    // Sua função aqui — simular com log por enquanto
    await syncMultipleRounds();

    return new Response("Sync concluído com sucesso!", { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Erro na sincronização", { status: 500 });
  }
}

// Essa seria sua função real que faz o fetch + update
async function syncMultipleRounds() {
  console.log("Sincronizando rodadas...");
  // Lógica aqui: fetch em API Cartola, update no Firestore, etc.
}
