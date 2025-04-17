
import { Link } from "react-router-dom";
import Logo from "@/components/ui/logo";

export function Header() {
  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm fixed top-0 left-0 right-0 z-50 h-12">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/e59fe19b-43b2-48c4-a38f-39b066bc5051.png" 
            alt="AI Ads Zen Garden" 
            className="h-8 w-8"
          />
        </Link>
        <div className="flex items-center gap-4">
          {/* Explore link removed from here */}
        </div>
      </div>
    </header>
  );
}
