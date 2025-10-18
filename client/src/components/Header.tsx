import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  isMenuOpen: boolean;
  onMenuToggle: () => void;
}

export default function Header({ isMenuOpen, onMenuToggle }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 backdrop-blur-md bg-background/80 border-b border-border z-50">
      <div className="flex items-center justify-between h-full px-6">
        <h1 className="font-serif text-lg tracking-widest" data-testid="text-header-name">
          LUCIJA ERCEGOVAC
        </h1>
        <Button
          size="icon"
          variant="ghost"
          onClick={onMenuToggle}
          data-testid="button-menu-toggle"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </Button>
      </div>
    </header>
  );
}
