
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import Explore from "./pages/Explore";
import Database from "./pages/Database";
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
import Auth from "./pages/Auth";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CompanyProvider>
      <BrowserRouter>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <div className="flex flex-col min-h-screen">
            <Header />
            <SidebarProvider defaultOpen={false}>
              <div className="flex w-full min-h-screen pt-12">
                <AppSidebar />
                <main className="flex-1 p-4 pt-2">
                  <SidebarTrigger className="mb-4" />
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/explore" element={<Explore />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/database" element={<Database />} />
                    
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
          </div>
        </TooltipProvider>
      </BrowserRouter>
    </CompanyProvider>
  </QueryClientProvider>
);

export default App;
