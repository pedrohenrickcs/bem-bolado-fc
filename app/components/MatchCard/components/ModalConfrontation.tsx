import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { Handshake, ThumbsDown, ThumbsUp } from "lucide-react";
import { DialogHeader } from "~/components/ui/dialog";

type ResultadoContagem = {
  v: number;
  e: number;
  d: number;
};

export default function contarResultados(arr: string[]): ResultadoContagem {
  return arr.reduce(
    (acc, res) => {
      if (res === "v") acc.v++;
      else if (res === "e") acc.e++;
      else if (res === "d") acc.d++;
      return acc;
    },
    { v: 0, e: 0, d: 0 }
  );
}

export function ModalConfrontationDialog({
  open,
  onOpenChange,
  mandante,
  visitante,
  nomeMandante,
  nomeVisitante,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mandante: string;
  visitante: string;
  nomeMandante: string;
  nomeVisitante: string;
}) {
  const estatisticasMandante = contarResultados(
    Array.isArray(mandante) ? mandante : []
  );
  const estatisticasVisitante = contarResultados(
    Array.isArray(visitante) ? visitante : []
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Histórico do Confronto</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 text-sm md:grid-cols-2">
          <div>
            <h2 className="text-base font-semibold mb-2 text-center">
              {nomeMandante} (Mandante)
            </h2>
            <ul className="space-y-1">
              <li className="flex items-center justify-center gap-2">
                <ThumbsUp className="w-4 h-4 text-green-600" />
                {estatisticasMandante.v} Vitórias
              </li>
              <li className="flex items-center justify-center gap-2">
                <Handshake className="w-4 h-4 text-yellow-500" />
                {estatisticasMandante.e} Empates
              </li>
              <li className="flex items-center justify-center gap-2">
                <ThumbsDown className="w-4 h-4 text-red-600" />
                {estatisticasMandante.d} Derrotas
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-base font-semibold mb-2 text-center">
              {nomeVisitante} (Visitante)
            </h2>
            <ul className="space-y-1">
              <ul className="space-y-1">
                <li className="flex items-center gap-2 justify-center">
                  <ThumbsUp className="w-4 h-4 text-green-600" />
                  {estatisticasVisitante.v} Vitórias
                </li>
                <li className="flex items-center gap-2 justify-center">
                  <Handshake className="w-4 h-4 text-yellow-500" />
                  {estatisticasVisitante.e} Empates
                </li>
                <li className="flex items-center gap-2 justify-center">
                  <ThumbsDown className="w-4 h-4 text-red-600" />
                  {estatisticasVisitante.d} Derrotas
                </li>
              </ul>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
