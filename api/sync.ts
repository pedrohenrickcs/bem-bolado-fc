import type { VercelRequest, VercelResponse } from '@vercel/node';
import { syncMultipleRounds } from '../app/lib/syncCartolaToFirestore';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const start = Number(req.query.start) || 18;
    const end = Number(req.query.end) || 21;

    await syncMultipleRounds(start, end);

    return res.status(200).json({
      message: `Rodadas ${start} até ${end} sincronizadas com sucesso!`,
    });
  } catch (error: any) {
    console.error('Erro ao sincronizar rodadas:', error);
    return res.status(500).json({
      message: 'Erro interno ao sincronizar rodadas',
      error: error.message,
    });
  }
}
