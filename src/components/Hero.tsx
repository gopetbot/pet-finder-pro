import { Button } from "@/components/ui/button";
import { Camera, MessageCircle, Search } from "lucide-react";
export const Hero = () => {
  return <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden gradient-hero">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" style={{
        animationDelay: '2s'
      }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl" />
      </div>

      {/* Paw prints decoration */}
      <div className="absolute inset-0 opacity-5">
        {[...Array(6)].map((_, i) => <span key={i} className="absolute text-6xl" style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        transform: `rotate(${Math.random() * 360}deg)`
      }}>
            🐾
          </span>)}
      </div>

      <div className="container relative z-10 px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-8 animate-fade-in">
            <span className="text-xl">🐕</span>
            <span className="font-semibold">Reencontre seu melhor amigo</span>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-foreground mb-6 leading-tight animate-fade-in" style={{
          animationDelay: '0.1s'
        }}>
            Encontre seu pet com{" "}
            <span className="text-transparent bg-clip-text gradient-warm">
              reconhecimento de imagem
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in" style={{
          animationDelay: '0.2s'
        }}>Envie uma foto pelo WhatsApp e nossa inteligência artificial encontra correspondências na base de animais perdidos e encontrados. Tecnologia que reúne famílias! 💛</p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in" style={{
          animationDelay: '0.3s'
        }}>
            <Button variant="hero" size="lg" className="w-full sm:w-auto">
              <Camera className="w-5 h-5" />
              Enviar foto agora
            </Button>
            <Button variant="whatsapp" size="lg" className="w-full sm:w-auto">
              <MessageCircle className="w-5 h-5" />
              Falar no WhatsApp
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto animate-fade-in" style={{
          animationDelay: '0.4s'
        }}>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-extrabold text-primary">9.500+</div>
              <div className="text-sm text-muted-foreground">Pets reunidos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-extrabold text-secondary-foreground">95%</div>
              <div className="text-sm text-muted-foreground">Precisão IA</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-extrabold text-accent">&lt;1min</div>
              <div className="text-sm text-muted-foreground">Tempo resposta</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-gentle">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-muted-foreground/50 rounded-full animate-pulse-soft" />
        </div>
      </div>
    </section>;
};