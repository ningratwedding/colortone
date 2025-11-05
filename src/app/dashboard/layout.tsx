"use client"

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart,
  Home,
  Package,
  PanelLeft,
  Settings,
  Upload,
  UserCircle,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const menuItems = [
  { href: "/dashboard", label: "Overview", icon: Home },
  { href: "/dashboard/products", label: "Products", icon: Package },
  { href: "/dashboard/upload", label: "Upload", icon: Upload },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const pathname = usePathname();
    
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar className="hidden lg:flex lg:flex-col lg:border-r">
          <SidebarHeader className="p-4">
            <Link href="/" className="flex items-center gap-2 font-semibold">
                <UserCircle className="h-6 w-6"/>
                <span>Creator Dashboard</span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map(({ href, label, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === href}
                    className="justify-start"
                  >
                    <Link href={href}>
                      <Icon className="mr-2 h-4 w-4" />
                      {label}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <div className="flex flex-col flex-1">
          <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4 lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0">
                  <PanelLeft className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="sm:max-w-xs p-0">
                  <SidebarHeader className="p-4 border-b">
                    <Link href="/" className="flex items-center gap-2 font-semibold">
                        <UserCircle className="h-6 w-6"/>
                        <span>Creator Dashboard</span>
                    </Link>
                  </SidebarHeader>
                  <nav className="grid gap-2 text-lg font-medium p-4">
                  {menuItems.map(({ href, label, icon: Icon }) => (
                    <Link
                        key={href}
                        href={href}
                        className={cn(
                        "flex items-center gap-4 px-2.5 rounded-lg py-2",
                        pathname === href
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Icon className="h-5 w-5" />
                        {label}
                    </Link>
                    ))}
                  </nav>
              </SheetContent>
            </Sheet>
          </header>
          <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
