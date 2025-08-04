import { collection, doc, getDocs, writeBatch } from "firebase/firestore";
import { getCartolaMatches } from "./apiCartola";
import { db } from "./firebase";

export async function syncMultipleRounds(start: number, end: number) {
    const existingMatchesSnapshot = await getDocs(collection(db, "matches"));
    const existingMatches = new Map();
    
    existingMatchesSnapshot.forEach(doc => {
        existingMatches.set(doc.id, doc.data());
    });

    const roundPromises = [];
    
    for (let round = start; round <= end; round++) {
        roundPromises.push(processRound(round, existingMatches));
    }
    
    await Promise.all(roundPromises);
    
    console.log("Todas as rodadas sincronizadas!");
}

async function processRound(round: number, existingMatches: Map<string, any>) {
    const partidas = await getCartolaMatches(round);
    const batch = writeBatch(db);
    
    for (const partida of partidas) {
        const ref = doc(db, "matches", partida.id);
        const existingData = existingMatches.get(partida.id) || {};
        
        batch.set(ref, {
            ...partida,
            round,
            votes: existingData.votes ?? {},
            placar_oficial_mandante: partida.placar_oficial_mandante,
            placar_oficial_visitante: partida.placar_oficial_visitante,
            status_cronometro_tr: partida.status_cronometro_tr,
            status_transmissao_tr: partida.status_transmissao_tr,
            periodo_tr: partida.periodo_tr,
            inicio_cronometro_tr: partida.inicio_cronometro_tr,
            confronto_mandante: partida.confronto_mandante,
            confronto_visitante: partida.confronto_visitante,
        }, { merge: true });
    }
    
    await batch.commit();
}
