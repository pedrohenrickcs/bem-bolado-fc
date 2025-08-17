import { Copy } from "lucide-react";
import { useMemo, useState } from "react";

const BRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 2,
});

const MOCK = {
  valorApostado: 50,
  totalGanho: 806.65,
  totalRetirado: 500.0,
};

type PixItem = { nome: string; chave: string };
const PIX: PixItem[] = [
  { nome: "Sérgio", chave: "(11) 99188-2396" },
  { nome: "Mota", chave: "(11) 94862-7256" },
  { nome: "Pedro", chave: "228.504.028-85" },
  { nome: "Gui", chave: "416.544.418-99" },
  { nome: "Elias", chave: "" },
];

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur p-4 shadow-sm hover:shadow-md transition-all">
      <div className="text-sm text-gray-600">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{BRL.format(value)}</div>
    </div>
  );
}

function PixItemRow({ nome, chave }: PixItem) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(chave);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="flex items-center justify-between rounded-xl border border-black/10 bg-white/70 p-3">
      <span className="text-sm sm:text-base">
        <strong>Pix do {nome}:</strong> {chave}
      </span>
      <button
        onClick={handleCopy}
        className="ml-3 flex items-center gap-1 rounded-lg border border-slate-300 px-2 py-1 text-xs hover:bg-slate-100 active:scale-95 transition"
      >
        <Copy className="h-4 w-4" />
        {copied ? "Copiado!" : "Copiar"}
      </button>
    </div>
  );
}

export default function Apostasy() {
  const { valorApostado, totalGanho, totalRetirado } = MOCK;

  const caixaAtual = useMemo(
    () => totalGanho - totalRetirado,
    [totalGanho, totalRetirado]
  );

  return (
    <main className="h-dvh overflow-y-auto bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">
            Bolados FC · Resumo de Apostas
          </h1>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard label="Valor apostado" value={valorApostado} />
          <StatCard label="Total ganho" value={totalGanho} />
          <StatCard label="Total retirado" value={totalRetirado} />
          <StatCard label="Caixa atual" value={caixaAtual} />
        </section>

        <section className="mt-8 pb-8">
          <h2 className="text-lg font-semibold">PIX da galera</h2>
          <p className="text-sm text-gray-600">
            Para facilitar os repasses, seguem as chaves:
          </p>
          <div className="mt-3 space-y-2">
            {PIX.map((item) => (
              <PixItemRow key={item.nome} {...item} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
