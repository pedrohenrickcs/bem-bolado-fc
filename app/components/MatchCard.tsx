import { doc, updateDoc } from "firebase/firestore";
import { Clock } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { db } from "../lib/firebase";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";

type Vote = "HOME" | "DRAW" | "AWAY";

type Match = {
  id: string;
  home_team: string;
  away_team: string;
  home_logo?: string;
  away_logo?: string;
  date: string;
  local?: string;
  championship?: string;
  votes?: Record<string, Vote>;
};

export function MatchCard({ match, userId }: { match: Match; userId: string }) {
  const userVote = match.votes?.[userId];
  const { tally, total } = computeVotes(match.votes ?? {});
  const percentages = getPercentages(tally);
  const isClosed = new Date(match.date).getTime() <= Date.now();

  const voteLabels: Record<Vote, string> = {
    HOME: match.home_team,
    DRAW: "Empate",
    AWAY: match.away_team,
  };

  async function handleVote(vote: Vote) {
    if (isClosed) return;
    const ref = doc(db, "matches", match.id);
    await updateDoc(ref, {
      [`votes.${userId}`]: vote,
    });
  }

  return (
    <Card className="bg-card shadow-sm border rounded-xl">
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
          <span className="text-lg text-muted-foreground">vs</span>
          <TeamInfo name={match.away_team} logo={match.away_logo} />
        </div>

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

        <div className="grid grid-cols-3 gap-2 mt-2">
          {(["HOME", "DRAW", "AWAY"] as Vote[]).map((v) => (
            <Button
              key={v}
              variant={userVote === v ? "default" : "outline"}
              size="sm"
              disabled={isClosed}
              onClick={() => handleVote(v)}
              className="text-xs py-2"
            >
              {voteLabels[v]}
            </Button>
          ))}
        </div>
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

function computeVotes(votes: Record<string, Vote>) {
  const tally: Record<Vote, number> = { HOME: 0, DRAW: 0, AWAY: 0 };
  Object.values(votes).forEach((v) => {
    tally[v] = (tally[v] || 0) + 1;
  });
  const total = Object.values(tally).reduce((sum, val) => sum + val, 0);
  return { tally, total };
}

function getPercentages(tally: Record<Vote, number>) {
  const total = Object.values(tally).reduce((s, n) => s + n, 0);
  return {
    HOME: total ? Math.round((tally.HOME / total) * 100) : 0,
    DRAW: total ? Math.round((tally.DRAW / total) * 100) : 0,
    AWAY: total ? Math.round((tally.AWAY / total) * 100) : 0,
  };
}

function getInitial(name: string) {
  return name?.[0]?.toUpperCase() || "?";
}
