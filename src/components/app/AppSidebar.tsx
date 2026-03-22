import { LayoutDashboard, FileText, LayoutTemplate, Sparkles, Download, Shield, ClipboardCopy } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { NavLink } from "@/components/NavLink";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { UserMenu } from "@/components/auth/UserMenu";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Create Resume", url: "/create", icon: FileText },
  { title: "Templates", url: "/templates", icon: LayoutTemplate },
  { title: "Resume Score", url: "/score", icon: Sparkles },
  { title: "Export", url: "/export", icon: Download },
  { title: "Copy Prompt", url: "/prompt", icon: ClipboardCopy },
  { title: "Admin Panel", url: "/admin", icon: Shield },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { pathname } = useLocation();

  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarContent className="bg-background flex flex-col justify-between h-full">
        <SidebarGroup>
          <Link to="/" className="flex items-center gap-2 px-2 py-4">
            <span className="text-2xl">📄</span>
            {!collapsed && <span className="font-bold text-foreground">ResumeGPT</span>}
          </Link>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent"
                      activeClassName="bg-primary text-primary-foreground font-medium"
                    >
                      <item.icon className="h-5 w-5" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <div className="p-4 mt-auto border-t">
          <div className="flex items-center justify-center">
            <UserMenu />
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
