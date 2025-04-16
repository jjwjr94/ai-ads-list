
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import LandingPage from "./pages/LandingPage";
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
  DataAnalyticsPage,
  WebAppDevelopmentPage,
  AccountManagementPage,
  SocialMediaPage,
  InfluencerMarketingPage,
  BrandManagementPage,
  AdFraudPage,
  AdNativePage,
  CopywritingPage,
  AnalyticsPage,
  SeoPage
} from "./pages/CategoryPages";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CompanyProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SidebarProvider defaultOpen={false}>
            <div className="min-h-screen flex w-full">
              <AppSidebar />
              <main className="flex-1">
                <SidebarTrigger className="m-4" />
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/seo-tools" element={<SeoTools />} />
                  <Route path="/explore" element={<Explore />} />
                  <Route path="/admin" element={<Admin />} />
                  
                  {/* Category Pages */}
                  <Route path="/strategy-planning" element={<StrategyPlanningPage />} />
                  <Route path="/creative-content" element={<CreativeContentPage />} />
                  <Route path="/performance-media" element={<PerformanceMediaPage />} />
                  <Route path="/seo-organic" element={<SeoOrganicPage />} />
                  <Route path="/data-analytics" element={<DataAnalyticsPage />} />
                  <Route path="/web-app-development" element={<WebAppDevelopmentPage />} />
                  <Route path="/account-management" element={<AccountManagementPage />} />
                  <Route path="/social-media" element={<SocialMediaPage />} />
                  <Route path="/influencer-marketing" element={<InfluencerMarketingPage />} />
                  <Route path="/brand-management" element={<BrandManagementPage />} />
                  <Route path="/ad-fraud" element={<AdFraudPage />} />
                  <Route path="/ad-native" element={<AdNativePage />} />
                  <Route path="/copywriting" element={<CopywritingPage />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                  <Route path="/seo" element={<SeoPage />} />
                  
                  {/* Catch-all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </SidebarProvider>
        </BrowserRouter>
      </TooltipProvider>
    </CompanyProvider>
  </QueryClientProvider>
);

export default App;
