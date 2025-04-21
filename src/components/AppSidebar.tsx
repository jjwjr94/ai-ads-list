import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Database, FolderTree } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { Category } from "@/types/frontend.models";

const categoryLinks = [
  { title: Category.STRATEGY_PLANNING, path: '/strategy-planning' },
  { title: Category.CREATIVE_CONTENT, path: '/creative-content' },
  { title: Category.PERFORMANCE_MEDIA, path: '/performance-media' },
  { title: Category.SEO_ORGANIC, path: '/seo-organic' },
  { title: Category.DATA_ANALYTICS, path: '/data-analytics' },
  { title: Category.WEB_APP_DEVELOPMENT, path: '/web-app-development' },
  { title: Category.ACCOUNT_MANAGEMENT, path: '/account-management' },
  { title: Category.SOCIAL_MEDIA, path: '/social-media' },
  { title: Category.INFLUENCER_MARKETING, path: '/influencer-marketing' },
  { title: Category.BRAND_MANAGEMENT, path: '/brand-management' },
  { title: Category.AD_FRAUD, path: '/ad-fraud' },
  { title: Category.AI_NATIVE, path: '/ai-native' },
  { title: Category.B2B_LEAD_GEN, path: '/b2b-lead-gen' },
  { title: Category.CAMPAIGN_OPERATIONS, path: '/campaign-operations' },
  { title: Category.ECOMMERCE, path: '/ecommerce' },
  { title: Category.SIMULATION_FORECASTING, path: '/simulation-forecasting' },
  { title: Category.AFFILIATE, path: '/affiliate' }
];

const formatCategoryTitle = (categoryString: string): string => {
  return categoryString.replace(/_/g, ' ').replace(/&/g, ' & ');
};

export function AppSidebar() {
  const location = useLocation();
  const isOnCategoryPage = categoryLinks.some(link => location.pathname === link.path);

  return (
    <Sidebar collapsible="icon" variant="floating" className="border-none shadow-none mt-12">
      <SidebarHeader className="flex justify-end items-center p-2">
        {/* Logo removed from sidebar */}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Home">
                  <Link to="/" className="hover:bg-gray-100">
                    <LayoutDashboard />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Database">
                  <Link to="/database" className="hover:bg-gray-100">
                    <Database />
                    <span>Database</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Categories">
                  <Link to="/explore" className="hover:bg-gray-100">
                    <FolderTree />
                    <span>Categories</span>
                  </Link>
                </SidebarMenuButton>
                
                {/* Categories submenu - only show if on a category page */}
                {isOnCategoryPage && (
                  <SidebarMenuSub>
                    {categoryLinks.map((item) => (
                      <SidebarMenuSubItem key={item.path}>
                        <SidebarMenuSubButton asChild className="whitespace-normal break-words py-2 h-auto min-h-7">
                          <Link to={item.path}>
                            {formatCategoryTitle(item.title)}
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
