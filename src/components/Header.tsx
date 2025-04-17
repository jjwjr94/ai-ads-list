
import { Link } from "react-router-dom";
import Logo from "@/components/ui/logo";

export function Header() {
  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm fixed top-0 left-0 right-0 z-50 h-12">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/e4a4eaee-01dc-427a-9bcd-4e6cd49c99ee.png" 
            alt="AI Ads List" 
            className="h-8"
          />
        </Link>
        <div className="flex items-center gap-4">
          {/* Explore link removed from here */}
        </div>
      </div>
    </header>
  );
}
