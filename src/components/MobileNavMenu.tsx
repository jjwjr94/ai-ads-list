
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Database, Layers, ShieldCheck, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Session } from "@supabase/supabase-js";
import { useState, useEffect } from "react";

// Category links (same as AppSidebar)
const categoryLinks = [
  { title: "CREATIVE_CONTENT", path: "/creative-content" },
  { title: "PERFORMANCE_MEDIA", path: "/performance-media" },
  { title: "STRATEGY_PLANNING", path: "/strategy-planning" },
  { title: "SEO_ORGANIC", path: "/seo-organic" },
  { title: "DATA_ANALYTICS", path: "/data-analytics" },
  { title: "WEB_APP_DEVELOPMENT", path: "/web-app-development" },
  { title: "ACCOUNT_MANAGEMENT", path: "/account-management" },
  { title: "SOCIAL_MEDIA", path: "/social-media" },
  { title: "INFLUENCER_MARKETING", path: "/influencer-marketing" },
  { title: "BRAND_MANAGEMENT", path: "/brand-management" },
  { title: "AD_FRAUD", path: "/ad-fraud" },
  { title: "AI_NATIVE", path: "/ai-native" },
  { title: "B2B_LEAD_GEN", path: "/b2b-lead-gen" },
  { title: "CAMPAIGN_OPERATIONS", path: "/campaign-operations" },
  { title: "ECOMMERCE", path: "/ecommerce" },
  { title: "SIMULATION_FORECASTING", path: "/simulation-forecasting" },
  { title: "AFFILIATE", path: "/affiliate" },
];

function formatCategoryTitle(categoryString: string) {
  return (
    categoryString
      .replace(/_/g, " ")
      .replace(/&/g, " & ")
      .replace(/\b([a-z])/g, char => char.toUpperCase())
  );
}

interface MobileNavMenuProps {
  session: Session | null;
  onLogout: () => void;
}

export default function MobileNavMenu({ session, onLogout }: MobileNavMenuProps) {
  const location = useLocation();
  const navigate = useNavigate();

  // Detect if on a category page
  const isOnCategoryPage = categoryLinks.some(link => location.pathname === link.path);

  // Track open/closed state of categories submenu
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  // Auto-close submenu when navigating
  useEffect(() => {
    setCategoriesOpen(false);
  }, [location.pathname]);

  // Handler for submenu button
  const handleCategoriesClick = () => {
    setCategoriesOpen(prev => !prev);
  };

  return (
    <nav className="flex flex-col gap-1 p-4">
      {/* Auth button */}
      <div className="mb-2">
        {session ? (
          <Button variant="ghost" size="sm" className="w-full justify-start" onClick={onLogout}>
            Logout
          </Button>
        ) : (
          <Link to="/auth" className="w-full">
            <Button variant="ghost" size="sm" className="w-full flex items-center justify-start gap-2">
              <ShieldCheck className="h-5 w-5 mr-2" /> Login
            </Button>
          </Link>
        )}
      </div>
      {/* Main nav links */}
      <Link to="/" className="w-full">
        <Button
          variant="ghost"
          size="sm"
          className="w-full flex items-center justify-start gap-2"
        >
          <Home className="h-5 w-5 mr-2" /> Home
        </Button>
      </Link>
      <Link to="/database" className="w-full">
        <Button
          variant="ghost"
          size="sm"
          className="w-full flex items-center justify-start gap-2"
        >
          <Database className="h-5 w-5 mr-2" /> Database
        </Button>
      </Link>
      
      {/* Categories section: expandable on category pages */}
      {isOnCategoryPage ? (
        <div className="w-full">
          <Button
            variant="ghost"
            size="sm"
            className="w-full flex items-center justify-start gap-2"
            onClick={handleCategoriesClick}
            aria-expanded={categoriesOpen}
            aria-controls="mobile-categories-submenu"
          >
            <Layers className="h-5 w-5 mr-2" />
            Categories
            {categoriesOpen ? (
              <ChevronUp className="ml-auto w-4 h-4" />
            ) : (
              <ChevronDown className="ml-auto w-4 h-4" />
            )}
          </Button>
          {/* Submenu: only visible if open */}
          {categoriesOpen && (
            <div
              id="mobile-categories-submenu"
              className="bg-background shadow-lg rounded mt-1 mb-2 border z-40"
            >
              {categoryLinks.map(item => (
                <button
                  key={item.path}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-accent focus:bg-accent transition rounded ${
                    location.pathname === item.path
                      ? "bg-accent text-accent-foreground font-semibold"
                      : ""
                  }`}
                  onClick={() => navigate(item.path)}
                >
                  {formatCategoryTitle(item.title)}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <Link to="/explore" className="w-full">
          <Button
            variant="ghost"
            size="sm"
            className="w-full flex items-center justify-start gap-2"
          >
            <Layers className="h-5 w-5 mr-2" /> Categories
          </Button>
        </Link>
      )}

      <Link to="/feedback" className="w-full">
        <Button
          variant="ghost"
          size="sm"
          className="w-full flex items-center justify-start gap-2"
        >
          <HelpCircle className="h-5 w-5 mr-2" /> Feedback
        </Button>
      </Link>
    </nav>
  );
}

