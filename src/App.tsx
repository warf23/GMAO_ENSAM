
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import EquipmentListPage from "./pages/EquipmentListPage";
import EquipmentDetailPage from "./pages/EquipmentDetailPage";
import InterventionsPage from "./pages/InterventionsPage";
import InterventionDetailPage from "./pages/InterventionDetailPage";
import SparePartsPage from "./pages/SparePartsPage";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { initializeDataIfNeeded } from "@/utils/dataUtils";

const queryClient = new QueryClient();

const App = () => {
  // Initialize data when the app starts
  useEffect(() => {
    initializeDataIfNeeded();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/equipements" element={<EquipmentListPage />} />
              <Route path="/equipements/:id" element={<EquipmentDetailPage />} />
              <Route path="/maintenance/interventions" element={<InterventionsPage />} />
              <Route path="/maintenance/interventions/:id" element={<InterventionDetailPage />} />
              <Route path="/maintenance/preventif" element={<div className="p-6">Planning de maintenance préventive (à implémenter)</div>} />
              <Route path="/calendrier" element={<div className="p-6">Calendrier des interventions (à implémenter)</div>} />
              <Route path="/pieces" element={<SparePartsPage />} />
              <Route path="/statistiques" element={<div className="p-6">Statistiques et indicateurs (à implémenter)</div>} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
