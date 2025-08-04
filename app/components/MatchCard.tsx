import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import type { Match } from "~/types.ts/MatchesByRound";
import { computeVotes, getPercentages } from "~/utils/computeVotes";
import getInitial from "~/utils/getInitial";
import { VoteActions } from "./MatchCard/components/VoteActions";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";

function extractMinutes(inicio: string): string {
  const inicioDate = new Date(inicio);
  const agora = new Date();
  const diffMs = agora.getTime() - inicioDate.getTime();
  const diffMin = Math.floor(diffMs / 1000 / 60);

  return `${diffMin} min`;
}

function getPeriodLabel(periodo: string): string {
  switch (periodo) {
    case "PRIMEIRO_TEMPO":
      return "1º tempo";
    case "SEGUNDO_TEMPO":
      return "2º tempo";
    case "PAUSADO":
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
  const [minutos, setMinutos] = useState("");

  useEffect(() => {
    if (
      match.status_transmissao_tr === "EM_ANDAMENTO" &&
      match.status_cronometro_tr === "INICIADO" &&
      match.inicio_cronometro_tr !== ""
    ) {
      const update = () =>
        setMinutos(extractMinutes(match.inicio_cronometro_tr ?? ""));
      update();

      const interval = setInterval(update, 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [match]);

  console.info({
    status_transmissao_tr: match.status_transmissao_tr,
    status_cronometro_tr: match.status_cronometro_tr,
    periodo_tr: match.periodo_tr,
  });

  return (
    <Card className="bg-card shadow-sm border rounded-xl relative">
      <CardHeader className="pb-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{new Date(match.date).toLocaleString()}</span>
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
              {minutos ? (
                <>
                  {minutos}
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

              {match.periodo_tr !== "POS_JOGO" && (
                <div className="match-bar-container">
                  <div className="match-bar" />
                </div>
              )}
            </div>
          )}

        {/* {match.status_transmissao_tr === "ENCERRADA" && ( */}
        <span className="text-xs text-muted-foreground italic flex justify-center">
          {getPeriodLabel(match.status_transmissao_tr as string)}
        </span>
        {/* )} */}

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
