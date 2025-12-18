import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Eye } from "lucide-react";

const pets = [
  {
    id: 1,
    name: "Max",
    type: "Cachorro",
    breed: "Golden Retriever",
    status: "perdido",
    location: "São Paulo, SP",
    date: "15/12/2024",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop",
  },
  {
    id: 2,
    name: "Luna",
    type: "Gato",
    breed: "Siamês",
    status: "encontrado",
    location: "Rio de Janeiro, RJ",
    date: "14/12/2024",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop",
  },
  {
    id: 3,
    name: "Thor",
    type: "Cachorro",
    breed: "Husky Siberiano",
    status: "perdido",
    location: "Curitiba, PR",
    date: "13/12/2024",
    image: "https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=400&h=400&fit=crop",
  },
  {
    id: 4,
    name: "Mia",
    type: "Gato",
    breed: "Persa",
    status: "encontrado",
    location: "Belo Horizonte, MG",
    date: "12/12/2024",
    image: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&h=400&fit=crop",
  },
  {
    id: 5,
    name: "Bob",
    type: "Cachorro",
    breed: "Bulldog Francês",
    status: "perdido",
    location: "Porto Alegre, RS",
    date: "11/12/2024",
    image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=400&fit=crop",
  },
  {
    id: 6,
    name: "Nina",
    type: "Gato",
    breed: "Maine Coon",
    status: "encontrado",
    location: "Salvador, BA",
    date: "10/12/2024",
    image: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=400&h=400&fit=crop",
  },
];

export const PetGallery = () => {
  return (
    <section className="py-24 bg-card">
      <div className="container px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 rounded-full bg-secondary/20 text-secondary-foreground text-sm font-semibold mb-4">
            Pets cadastrados
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-foreground mb-4">
            Ajude a encontrar esses amigos
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Veja os pets cadastrados recentemente e ajude a reunir famílias
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {pets.map((pet, index) => (
            <div
              key={pet.id}
              className="group bg-background rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 hover:-translate-y-2 border border-border/50"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Image */}
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={pet.image}
                  alt={pet.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div
                  className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    pet.status === "perdido"
                      ? "bg-destructive text-destructive-foreground"
                      : "bg-accent text-accent-foreground"
                  }`}
                >
                  {pet.status}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{pet.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {pet.breed} • {pet.type}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {pet.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {pet.date}
                  </span>
                </div>

                <Button variant="outline" size="sm" className="w-full">
                  <Eye className="w-4 h-4" />
                  Ver detalhes
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="default" size="lg">
            Ver todos os pets
          </Button>
        </div>
      </div>
    </section>
  );
};
