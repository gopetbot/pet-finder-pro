import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { UploadSection } from "@/components/UploadSection";
import { PetGallery } from "@/components/PetGallery";
import { WhatsAppCTA } from "@/components/WhatsAppCTA";
import { Footer } from "@/components/Footer";
import { PalestrasList } from "@/components/PalestrasList";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <HowItWorks />
      <UploadSection />
      <PetGallery />
      <WhatsAppCTA />
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-10">Palestras Semanais</h2>
          <PalestrasList />
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default Index;
