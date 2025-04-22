
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ShieldCheck, HelpCircle, Menu, ChevronDown } from "lucide-react";
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
import { useResponsive } from "@/hooks/useResponsive";

// Category links (EXACT titles as seen on Explore page cards)
const categoryLinks = [
  { title: "Creative & Content", path: "/creative-content" },
  { title: "Performance & Media Buying", path: "/performance-media" },
  { title: "Strategy & Planning", path: "/strategy-planning" },
  { title: "SEO & Organic Growth", path: "/seo-organic" },
  { title: "Data & Analytics", path: "/data-analytics" },
  { title: "Web & App Development", path: "/web-app-development" },
  { title: "Account Management & Client Services", path: "/account-management" },
  { title: "Social Media & Community Management", path: "/social-media" },
  { title: "Influencer & Partnership Marketing", path: "/influencer-marketing" },
  { title: "Brand Management", path: "/brand-management" },
  { title: "Ad Fraud Detection & Prevention", path: "/ad-fraud" },
  { title: "AI-Native Agencies", path: "/ai-native" },
  { title: "B2B & Lead Gen", path: "/b2b-lead-gen" },
  { title: "Campaign Operations", path: "/campaign-operations" },
  { title: "Ecommerce", path: "/ecommerce" },
  { title: "Simulation/Forecasting", path: "/simulation-forecasting" },
  { title: "Affiliate", path: "/affiliate" },
];

export function Header() {
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();
  const { isMobile } = useResponsive();

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
      <div className="container mx-auto h-full flex items-center justify-between">
        {/* Logo left-aligned */}
        <Link to="/" className="flex items-center min-w-[44px]">
          <img 
            src="/lovable-uploads/e4a4eaee-01dc-427a-9bcd-4e6cd49c99ee.png" 
            alt="AI Ads List" 
            className="h-8"
          />
        </Link>
        {/* Center nav for desktop */}
        <nav className="hidden sm:flex flex-1 justify-center items-center gap-6">
          <Link to="/database">
            <Button variant="ghost" size="sm" className="flex items-center font-normal text-base">
              Database
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-1 font-normal text-base">
                <span className="flex items-center">
                  Categories
                  <ChevronDown className="h-4 w-4 ml-1" />
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="z-[9999] mt-1 bg-white min-w-[260px] border shadow-lg">
              {categoryLinks.map((item) => (
                <DropdownMenuItem
                  key={item.path}
                  className="cursor-pointer font-normal"
                  onClick={() => navigate(item.path)}
                >
                  {item.title}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
        {/* Right-side actions (auth/login, feedback) */}
        <div className="hidden sm:flex items-center gap-2 min-w-[106px] justify-end">
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
            <SheetContent side="right" className="w-64 p-0">
              <MobileNavMenu 
                session={session} 
                onLogout={handleLogout} 
                categoryLinks={categoryLinks}
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
