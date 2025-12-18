import { Button } from "@/components/ui/button";
import { MessageCircle, Smartphone, Zap, Shield } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Resposta instantânea",
    description: "Nossa IA responde em segundos",
  },
  {
    icon: Shield,
    title: "100% seguro",
    description: "Seus dados protegidos",
  },
  {
    icon: Smartphone,
    title: "Fácil de usar",
    description: "Sem apps para baixar",
  },
];

export const WhatsAppCTA = () => {
  return (
    <section className="py-24 bg-accent/5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="container px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-3xl p-8 md:p-12 shadow-card border border-border/50">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-6">
                  <MessageCircle className="w-4 h-4" />
                  Integração WhatsApp
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
                  Busque pelo{" "}
                  <span className="text-accent">WhatsApp</span>
                </h2>
                <p className="text-muted-foreground mb-8">
                  Envie a foto diretamente para nosso número. A IA analisa a imagem e 
                  retorna as correspondências em tempo real, tudo pelo chat!
                </p>

                <Button variant="whatsapp" size="lg" className="w-full sm:w-auto mb-8">
                  <MessageCircle className="w-5 h-5" />
                  Iniciar conversa
                </Button>

                {/* Features */}
                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                        <feature.icon className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground text-sm">
                          {feature.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Phone mockup */}
              <div className="relative">
                <div className="relative mx-auto w-64 h-[500px] bg-foreground rounded-[3rem] p-3 shadow-2xl">
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 w-20 h-6 bg-foreground rounded-full z-20" />
                  <div className="w-full h-full bg-background rounded-[2.5rem] overflow-hidden">
                    {/* WhatsApp header */}
                    <div className="bg-accent p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent-foreground/20 flex items-center justify-center">
                        🐾
                      </div>
                      <div>
                        <div className="text-accent-foreground font-semibold text-sm">
                          PetFinder IA
                        </div>
                        <div className="text-accent-foreground/70 text-xs">
                          online
                        </div>
                      </div>
                    </div>

                    {/* Chat messages */}
                    <div className="p-4 space-y-3 bg-muted/30">
                      <div className="bg-card rounded-2xl rounded-tl-none p-3 max-w-[80%] shadow-sm">
                        <p className="text-xs text-foreground">
                          Olá! 👋 Envie a foto do pet que você encontrou ou perdeu.
                        </p>
                      </div>

                      <div className="bg-accent/20 rounded-2xl rounded-tr-none p-3 max-w-[80%] ml-auto shadow-sm">
                        <div className="w-full aspect-square rounded-lg bg-secondary/50 flex items-center justify-center mb-2">
                          📷
                        </div>
                        <p className="text-xs text-foreground">Encontrei esse cachorrinho</p>
                      </div>

                      <div className="bg-card rounded-2xl rounded-tl-none p-3 max-w-[80%] shadow-sm">
                        <p className="text-xs text-foreground">
                          🔍 Analisando... Encontrei 2 possíveis correspondências!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-accent rounded-2xl shadow-lg flex items-center justify-center animate-float">
                  <MessageCircle className="w-8 h-8 text-accent-foreground" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
