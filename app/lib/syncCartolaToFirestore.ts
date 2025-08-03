import { doc, getDoc, setDoc } from "firebase/firestore";
import { getCartolaMatches } from "./apiCartola";
import { db } from "./firebase";

export async function syncMultipleRounds(start: number, end: number) {
    for (let round = start; round <= end; round++) {
        const partidas = await getCartolaMatches(round);

        for (const partida of partidas) {
        const ref = doc(db, "matches", partida.id);
        const snapshot = await getDoc(ref);

        const existingData = snapshot.exists() ? snapshot.data() : {};

        await setDoc(ref, {
        ...partida,
        round,
        votes: existingData.votes ?? {},
        placar_oficial_mandante: partida.placar_oficial_mandante ?? null,
        placar_oficial_visitante: partida.placar_oficial_visitante ?? null,
        status_cronometro_tr: partida.status_cronometro_tr ?? "",
        status_transmissao_tr: partida.status_transmissao_tr ?? "",
        periodo_tr: partida.periodo_tr ?? "",
        }, { merge: true });
    }
}

 console.log("Todas as rodadas sincronizadas!");
}
