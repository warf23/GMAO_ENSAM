import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  BarChart3, Box, Calendar, Package, 
  Settings, Wrench, X, ChevronDown, 
  LayoutDashboard
} from "lucide-react";
import { cn } from "@/lib/utils";

type SidebarItemProps = {
  icon: React.ElementType;
  title: string;
  path: string;
  isCollapsed: boolean;
  hasSubItems?: boolean;
  subItems?: { title: string; path: string }[];
};

const SidebarItem = ({ 
  icon: Icon, 
  title, 
  path, 
  isCollapsed, 
  hasSubItems = false,
  subItems = [] 
}: SidebarItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isActive = location.pathname === path || location.pathname.startsWith(path + "/");
  const isSubActive = subItems.some(item => location.pathname === item.path);

  return (
    <div className={cn("mb-1", hasSubItems && "flex flex-col")}>
      <Link
        to={hasSubItems ? "#" : path}
        onClick={hasSubItems ? () => setIsOpen(!isOpen) : undefined}
        className={cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          isActive ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground" : "",
          isSubActive ? "text-primary" : "",
          isCollapsed && "justify-center p-2"
        )}
      >
        <Icon size={20} className={isCollapsed ? "mx-auto" : ""} />
        {!isCollapsed && (
          <>
            <span className="flex-grow">{title}</span>
            {hasSubItems && (
              <ChevronDown size={16} className={cn("transition-transform", isOpen && "rotate-180")} />
            )}
          </>
        )}
      </Link>
      
      {hasSubItems && isOpen && !isCollapsed && (
        <div className="ml-6 mt-1 space-y-1 border-l border-sidebar-border pl-2">
          {subItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                location.pathname === item.path ? "text-primary" : ""
              )}
            >
              {item.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export const AppSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const sidebarItems = [
    { title: "Tableau de bord", icon: LayoutDashboard, path: "/" },
    { 
      title: "Équipements", 
      icon: Box, 
      path: "/equipements",
      hasSubItems: true,
      subItems: [
        { title: "Liste des équipements", path: "/equipements" },
        { title: "Fiches techniques", path: "/equipements/fiches" }
      ]
    },
    { 
      title: "Maintenance", 
      icon: Wrench, 
      path: "/maintenance",
      hasSubItems: true,
      subItems: [
        { title: "Interventions correctives", path: "/maintenance/interventions" },
        { title: "Maintenance préventive", path: "/maintenance/preventif" }
      ]
    },
    { title: "Planning", icon: Calendar, path: "/calendrier" },
    { title: "Pièces détachées", icon: Package, path: "/pieces" },
    { title: "Indicateurs", icon: BarChart3, path: "/statistiques" }
  ];

  return (
    <div
      className={cn(
        "flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-14 items-center border-b border-sidebar-border px-3">
        {!isCollapsed && (
          <h2 className="flex-1 font-semibold text-l text-primary">GMAO ENSAM Casa</h2>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="rounded-md p-1.5 text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {isCollapsed ? <Settings size={20} /> : <X size={20} />}
        </button>
      </div>
      
      <div className="flex-1 overflow-auto py-4 px-2">
        <nav className="flex flex-col">
          {sidebarItems.map((item) => (
            <SidebarItem
              key={item.path}
              icon={item.icon}
              title={item.title}
              path={item.path}
              isCollapsed={isCollapsed}
              hasSubItems={item.hasSubItems}
              subItems={item.subItems}
            />
          ))}
        </nav>
      </div>
      
      <div className="border-t border-sidebar-border p-3">
        <div className={cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
          isCollapsed ? "justify-center" : ""
        )}>
          {isCollapsed ? (
            <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
              T
            </div>
          ) : (
            <>
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                T
              </div>
              <div className="flex flex-col">
                <span className="font-medium">Technicien</span>
                <span className="text-xs text-sidebar-foreground/70">Connecté</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
