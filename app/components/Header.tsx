import { BarChart2, History, LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

type Props = {
  user: {
    name: string;
    email: string;
  };
  onLogout: () => void;
};

export function Header({ user, onLogout }: Props) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <header className="w-full border-b bg-background shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo e nome */}
        <div className="flex items-center gap-2 font-bold text-lg text-primary">
          <span role="img" aria-label="bola de futebol">
            ⚽
          </span>
          Bem Bolado FC
        </div>

        {/* Menu de navegação */}
        <nav className="flex items-center gap-4 text-sm text-muted-foreground">
          <button className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer">
            <BarChart2 className="w-4 h-4" />
            Ranking
          </button>
          <button className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer">
            <History className="w-4 h-4" />
            Histórico
          </button>
        </nav>

        {/* Avatar + Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-muted/50 cursor-pointer"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              {user.name}
              <br />
              <span className="text-[10px] text-gray-500">{user.email}</span>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
              <User className="w-4 h-4 text-primary" />
              Perfil
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={onLogout}
              className="flex items-center gap-2 text-destructive hover:text-destructive cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
