
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
    title: "Admin",
    icon: Database,
    path: "/admin",
  },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader className="flex justify-end items-center p-2">
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/e59fe19b-43b2-48c4-a38f-39b066bc5051.png" 
            alt="Logo" 
            className="h-10 w-10" 
          />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link to={item.path}>
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
