
import { Link } from "react-router-dom";
import { LayoutDashboard, Search, Database } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Home",
    icon: LayoutDashboard,
    path: "/",
  },
  {
    title: "Explore",
    icon: Search,
    path: "/explore",
  },
  {
    title: "Database",
    icon: Database,
    path: "/admin",
  },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" variant="floating" className="border-none shadow-none mt-12">
      <SidebarHeader className="flex justify-end items-center p-2">
        {/* Logo removed from sidebar */}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-700">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link to={item.path} className="hover:bg-gray-100">
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
