import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Upload, X, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const UploadSection = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      toast({
        title: "Busca realizada! 🔍",
        description: "Encontramos 3 possíveis correspondências para o seu pet.",
      });
    }, 2000);
  };

  return (
    <section className="py-24 gradient-soft">
      <div className="container px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-4">
            Encontre agora
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-foreground mb-4">
            Envie a foto do pet
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Nossa IA analisa características únicas e busca correspondências em nossa base de dados
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div
            className={`relative rounded-3xl border-2 border-dashed transition-all duration-300 ${
              isDragging
                ? "border-primary bg-primary/5 scale-105"
                : selectedImage
                ? "border-accent bg-accent/5"
                : "border-border hover:border-primary/50 bg-card"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            {selectedImage ? (
              <div className="p-6">
                <div className="relative aspect-video rounded-2xl overflow-hidden mb-6">
                  <img
                    src={selectedImage}
                    alt="Pet selecionado"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-3 right-3 w-10 h-10 rounded-full bg-foreground/80 text-background flex items-center justify-center hover:bg-foreground transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <Button
                  variant="hero"
                  size="lg"
                  className="w-full"
                  onClick={handleSearch}
                  disabled={isSearching}
                >
                  {isSearching ? (
                    <>
                      <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Buscando correspondências...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Buscar pet na base
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <Camera className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Arraste uma foto aqui
                </h3>
                <p className="text-muted-foreground mb-6">
                  ou clique para selecionar do seu dispositivo
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                  }}
                />
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-5 h-5" />
                  Selecionar arquivo
                </Button>
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {["📸 Boa iluminação", "🐕 Rosto visível", "📐 Foto nítida", "🎯 Focado no pet"].map((tip, i) => (
              <div key={i} className="text-sm text-muted-foreground">
                {tip}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
