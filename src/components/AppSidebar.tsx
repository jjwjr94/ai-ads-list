
import { Link } from "react-router-dom";
import { LayoutDashboard, Database } from "lucide-react";
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
  { title: Category.AI_NATIVE, path: '/ai-native' }
];

const formatCategoryTitle = (categoryString: string): string => {
  return categoryString.replace(/_/g, ' ');
};

export function AppSidebar() {
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
                
                {/* Categories submenu */}
                <SidebarMenuSub>
                  {categoryLinks.map((item) => (
                    <SidebarMenuSubItem key={item.path}>
                      <SidebarMenuSubButton asChild>
                        <Link to={item.path}>
                          {formatCategoryTitle(item.title)}
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Database">
                  <Link to="/database" className="hover:bg-gray-100">
                    <Database />
                    <span>Database</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
