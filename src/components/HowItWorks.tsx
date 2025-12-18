import { Camera, Search, Heart } from "lucide-react";

const steps = [
  {
    icon: Camera,
    title: "Envie a foto",
    description: "Tire uma foto do animal perdido ou encontrado e envie pelo WhatsApp ou faça upload direto na plataforma.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Search,
    title: "IA analisa",
    description: "Nossa inteligência artificial compara características únicas como cor, raça, porte e marcas distintivas.",
    color: "bg-secondary/20 text-secondary-foreground",
  },
  {
    icon: Heart,
    title: "Reencontro",
    description: "Conectamos você com os possíveis tutores através de notificações e facilita o reencontro feliz!",
    color: "bg-accent/10 text-accent",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-24 bg-card">
      <div className="container px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            Simples e rápido
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-foreground mb-4">
            Como funciona?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Em apenas 3 passos simples, você pode encontrar seu pet ou ajudar alguém a reencontrar o seu
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-border to-transparent" />
              )}

              <div className="bg-background rounded-2xl p-8 shadow-card hover:shadow-hover transition-all duration-300 hover:-translate-y-2 border border-border/50">
                {/* Step number */}
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full gradient-warm flex items-center justify-center text-primary-foreground font-bold text-sm shadow-warm">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon className="w-8 h-8" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
