import { Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="py-12 bg-foreground text-background">
      <div className="container px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🐾</span>
            <span className="font-bold text-xl">PetFinder</span>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-background/70">
            <a href="#" className="hover:text-background transition-colors">
              Como funciona
            </a>
            <a href="#" className="hover:text-background transition-colors">
              Pets perdidos
            </a>
            <a href="#" className="hover:text-background transition-colors">
              Cadastrar pet
            </a>
            <a href="#" className="hover:text-background transition-colors">
              Contato
            </a>
          </nav>

          <div className="flex items-center gap-1 text-sm text-background/70">
            Feito com <Heart className="w-4 h-4 text-destructive fill-destructive" /> para reunir famílias
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-background/10 text-center text-sm text-background/50">
          © 2024 PetFinder. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};
