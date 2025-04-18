
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { Bell, UserCircle } from "lucide-react";

export const MainLayout = () => {
  return (
    <div className="flex h-screen w-full bg-light">
      <AppSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="h-14 border-b border-border bg-white flex items-center justify-between px-6">
          <div>
            <h1 className="text-lg font-medium text-dark">MainFlow GMAO</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="rounded-full p-1.5 text-muted-foreground hover:bg-muted">
              <Bell size={20} />
            </button>
            <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 cursor-pointer">
              <UserCircle size={20} />
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
