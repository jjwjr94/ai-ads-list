
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Index from "./pages/Index"; // Changed from LandingPage to Index
import NotFound from "./pages/NotFound";
import SeoTools from "./pages/SeoTools";
import Explore from "./pages/Explore";
import Admin from "./pages/Admin";
import { CompanyProvider } from "./context/CompanyContext";
import {
  StrategyPlanningPage,
  CreativeContentPage,
  PerformanceMediaPage,
  SeoOrganicPage,
  AnalyticsPage,
  WebAppDevelopmentPage,
  AccountManagementPage,
  SocialMediaPage,
  InfluencerMarketingPage,
  BrandManagementPage,
  AdFraudPage,
  AiNativePage
} from "./pages/CategoryPages";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CompanyProvider>
      <BrowserRouter>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <SidebarProvider defaultOpen={false}>
            <div className="min-h-screen flex w-full">
              <AppSidebar />
              <main className="flex-1">
                <SidebarTrigger className="m-4" />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/seo-tools" element={<SeoTools />} />
                  <Route path="/explore" element={<Explore />} />
                  <Route path="/admin" element={<Admin />} />
                  
                  {/* Category Pages */}
                  <Route path="/strategy-planning" element={<StrategyPlanningPage />} />
                  <Route path="/creative-content" element={<CreativeContentPage />} />
                  <Route path="/performance-media" element={<PerformanceMediaPage />} />
                  <Route path="/seo-organic" element={<SeoOrganicPage />} />
                  <Route path="/data-analytics" element={<AnalyticsPage />} />
                  <Route path="/web-app-development" element={<WebAppDevelopmentPage />} />
                  <Route path="/account-management" element={<AccountManagementPage />} />
                  <Route path="/social-media" element={<SocialMediaPage />} />
                  <Route path="/influencer-marketing" element={<InfluencerMarketingPage />} />
                  <Route path="/brand-management" element={<BrandManagementPage />} />
                  <Route path="/ad-fraud" element={<AdFraudPage />} />
                  <Route path="/ai-native" element={<AiNativePage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </SidebarProvider>
        </TooltipProvider>
      </BrowserRouter>
    </CompanyProvider>
  </QueryClientProvider>
);

export default App;
