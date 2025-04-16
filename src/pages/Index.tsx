
import { Hero } from "@/components/sections/Hero";
import { Features } from "@/components/sections/Features";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Newsletter } from "@/components/sections/Newsletter";
import { Footer } from "@/components/sections/Footer";
import { CompanyProvider } from "@/context/CompanyContext";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <CompanyProvider>
        <Hero />
        <Features />
        <HowItWorks />
        <Newsletter />
        <Footer />
      </CompanyProvider>
    </div>
  );
};

export default Index;
