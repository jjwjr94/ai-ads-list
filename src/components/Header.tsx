
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ShieldCheck, HelpCircle, Menu, Database, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import MobileNavMenu from "./MobileNavMenu";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

// List of categories (reuse from Sidebar/MobileNavMenu for consistency)
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

export function Header() {
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

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
        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-2">
          {/* Database link */}
          <Link to="/database">
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <Database className="h-4 w-4 mr-1" /> Database
            </Button>
          </Link>
          {/* Categories dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                {/* Chevron + label */}
                <span className="flex items-center">
                  Categories
                  <ChevronDown className="h-4 w-4 ml-1" />
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="z-[9999] mt-1 bg-white">
              {categoryLinks.map((item) => (
                <DropdownMenuItem
                  key={item.path}
                  className="cursor-pointer"
                  onClick={() => navigate(item.path)}
                >
                  {formatCategoryTitle(item.title)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Auth */}
          {session ? (
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to="/auth">
                    <Button variant="ghost" size="icon">
                      <ShieldCheck className="h-5 w-5" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Login</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {/* Feedback */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/feedback">
                  <Button variant="ghost" size="icon">
                    <HelpCircle className="h-5 w-5" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Feedback</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        {/* Mobile nav button */}
        <div className="flex sm:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-52 p-0">
              <MobileNavMenu session={session} onLogout={handleLogout} />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
