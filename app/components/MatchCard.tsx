import { Clock, Handshake, ThumbsDown, ThumbsUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import type { Match } from "~/types.ts/MatchesByRound";
import { computeVotes, getPercentages } from "~/utils/computeVotes";
import getInitial from "~/utils/getInitial";
import { VoteActions } from "./MatchCard/components/VoteActions";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

type ResultCount = {
  w: number;
  d: number;
  l: number;
};

function extractElapsedMinutes(start: string): string {
  const startDate = new Date(start);
  const now = new Date();
  const diffMs = now.getTime() - startDate.getTime();
  const diffMin = Math.floor(diffMs / 1000 / 60);

  return `${diffMin} min`;
}

function getPeriodLabel(period: string): string {
  switch (period) {
    case "PRIMEIRO_TEMPO":
      return "1º tempo";
    case "SEGUNDO_TEMPO":
      return "2º tempo";
    case "INTERVALO":
      return "Intervalo";
    case "CRIADA":
      return "Começa em breve";
    case "ENCERRADA":
      return "Transmissão encerrada";
    default:
      return "";
  }
}

export function MatchCard({ match, userId }: { match: Match; userId: string }) {
  const userVote = match.votes?.[userId];
  const { tally } = computeVotes(match.votes ?? {});
  const percentages = getPercentages(tally);
  const isClosed = new Date(match.date).getTime() <= Date.now();
  const [elapsedTime, setElapsedTime] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (
      match.status_transmissao_tr === "EM_ANDAMENTO" &&
      match.status_cronometro_tr === "INICIADO" &&
      match.inicio_cronometro_tr !== ""
    ) {
      const update = () =>
        setElapsedTime(extractElapsedMinutes(match.inicio_cronometro_tr ?? ""));
      update();

      const interval = setInterval(update, 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [match]);

  return (
    <Card className="bg-card shadow-sm border rounded-xl relative">
      <div className="grid grid-cols-1 justify-items-center">
        <Button
          variant="outline"
          size="default"
          onClick={() => setDialogOpen(true)}
          className="mt-2 cursor-pointer"
        >
          Estatísticas dos últimos jogos
        </Button>
      </div>

      <ConfrontationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        homeHistory={match.confronto_mandante ?? ""}
        awayHistory={match.confronto_visitante ?? ""}
        homeName={match.home_team}
        awayName={match.away_team}
      />

      <CardHeader className="pb-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>
              {new Date(match.date).toLocaleDateString("pt-BR")} às{" "}
              {new Date(match.date).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <Badge variant="outline">{match.championship ?? "Brasileirão"}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {match.local && (
          <div className="flex justify-center">
            <span className="text-xs text-muted-foreground italic">
              Local: {match.local}
            </span>
          </div>
        )}
        <div className="flex items-center justify-center gap-4 text-base font-medium">
          <TeamInfo name={match.home_team} logo={match.home_logo} />
          <div className="text-center">
            <Badge
              variant="outline"
              className="text-[11px] px-2 text-muted-foreground text-center"
            >
              {elapsedTime ? (
                <>
                  {match.periodo_tr !== "INTERVALO" && `${elapsedTime} - `}
                  {match.periodo_tr &&
                    `${getPeriodLabel(match.periodo_tr as string)}`}
                </>
              ) : (
                "VS"
              )}
            </Badge>
          </div>
          <TeamInfo name={match.away_team} logo={match.away_logo} />
        </div>

        {match.placar_oficial_mandante !== null &&
          match.placar_oficial_visitante !== null && (
            <div className="text-center mt-2 relative">
              <div className="text-lg font-semibold text-foreground">
                {match.placar_oficial_mandante} x{" "}
                {match.placar_oficial_visitante}
              </div>

              {match.status_transmissao_tr === "EM_ANDAMENTO" && (
                <div className="match-bar-container">
                  <div className="match-bar" />
                </div>
              )}
            </div>
          )}

        <span className="text-xs text-muted-foreground italic flex justify-center">
          {getPeriodLabel(match.status_transmissao_tr as string)}
        </span>

        <div className="space-y-3">
          <VoteProgressBar
            label={`Vitória ${match.home_team}`}
            value={percentages.HOME}
            count={tally.HOME}
          />
          <VoteProgressBar
            label="Empate"
            value={percentages.DRAW}
            count={tally.DRAW}
          />
          <VoteProgressBar
            label={`Vitória ${match.away_team}`}
            value={percentages.AWAY}
            count={tally.AWAY}
          />
        </div>
        <VoteActions
          match={match}
          userId={userId}
          currentVote={userVote}
          isClosed={isClosed}
        />
      </CardContent>
    </Card>
  );
}

function TeamInfo({ name, logo }: { name: string; logo?: string }) {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <Avatar className="h-6 w-6 text-xs">
        {logo ? (
          <img src={logo} alt={name} className="h-6 w-6 rounded-full" />
        ) : (
          <AvatarFallback>{getInitial(name)}</AvatarFallback>
        )}
      </Avatar>
      <span className="text-sm">{name}</span>
    </div>
  );
}

function VoteProgressBar({
  label,
  value,
  count,
}: {
  label: string;
  value: number;
  count: number;
}) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm font-normal">
        <span>{label}</span>
        <span>
          {value}%{" "}
          <span className="text-xs text-muted-foreground">({count})</span>
        </span>
      </div>
      <Progress value={value} />
    </div>
  );
}

function countResults(arr: string[]): ResultCount {
  return arr.reduce(
    (acc, res) => {
      if (res === "v") acc.w++;
      else if (res === "e") acc.d++;
      else if (res === "d") acc.l++;
      return acc;
    },
    { w: 0, d: 0, l: 0 }
  );
}

export function ConfrontationDialog({
  open,
  onOpenChange,
  homeHistory,
  awayHistory,
  homeName,
  awayName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  homeHistory: string;
  awayHistory: string;
  homeName: string;
  awayName: string;
}) {
  const homeStats = countResults(Array.isArray(homeHistory) ? homeHistory : []);
  const awayStats = countResults(Array.isArray(awayHistory) ? awayHistory : []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Estatísticas dos últimos jogos</DialogTitle>
        </DialogHeader>

        <div className="grid text-sm md:grid-cols-2">
          <div>
            <h2 className="text-base font-semibold mb-2 text-center">
              {homeName} (mandante)
            </h2>
            <ul className="space-y-1">
              <li className="flex items-center justify-center gap-2">
                <ThumbsUp className="w-4 h-4 text-green-600" />
                {homeStats.w} Vitórias
              </li>
              <li className="flex items-center justify-center gap-2">
                <Handshake className="w-4 h-4 text-yellow-500" />
                {homeStats.d} Empates
              </li>
              <li className="flex items-center justify-center gap-2">
                <ThumbsDown className="w-4 h-4 text-red-600" />
                {homeStats.l} Derrotas
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-base font-semibold mb-2 text-center">
              {awayName} (Visitante)
            </h2>
            <ul className="space-y-1">
              <li className="flex items-center gap-2 justify-center">
                <ThumbsUp className="w-4 h-4 text-green-600" />
                {awayStats.w} Vitórias
              </li>
              <li className="flex items-center gap-2 justify-center">
                <Handshake className="w-4 h-4 text-yellow-500" />
                {awayStats.d} Empates
              </li>
              <li className="flex items-center gap-2 justify-center">
                <ThumbsDown className="w-4 h-4 text-red-600" />
                {awayStats.l} Derrotas
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
