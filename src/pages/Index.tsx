import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { UploadSection } from "@/components/UploadSection";
import { PetGallery } from "@/components/PetGallery";
import { WhatsAppCTA } from "@/components/WhatsAppCTA";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <HowItWorks />
      <UploadSection />
      <PetGallery />
      <WhatsAppCTA />
      <Footer />
    </main>
  );
};

export default Index;
