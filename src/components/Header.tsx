
import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm z-50 h-12">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <Link to="/" className="text-[#9b87f5] font-medium text-lg hover:text-[#7E69AB] transition-colors">
          AI Ads Zen Garden
        </Link>
        <div className="flex items-center gap-4">
          <Link 
            to="/explore" 
            className="text-sm text-gray-600 hover:text-[#9b87f5] transition-colors"
          >
            Explore
          </Link>
        </div>
      </div>
    </header>
  );
}
