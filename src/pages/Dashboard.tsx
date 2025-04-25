
import { useState, useEffect } from 'react';
import { MaintenanceCalendar } from '@/components/dashboard/MaintenanceCalendar';
import { ParetoChart } from '@/components/dashboard/ParetoChart';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { RecentInterventions } from '@/components/dashboard/RecentInterventions';
import { PerformanceMetrics } from '@/components/dashboard/PerformanceMetrics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MaintenanceEvent } from '@/types/maintenance';
import { 
  initializeDataIfNeeded,
  getMaintenanceEventsFromInterventions,
  getDashboardStats
} from '@/utils/dataUtils';

const Dashboard = () => {
  const [tabValue, setTabValue] = useState<"today" | "week" | "month">("today");
  const [maintenanceEvents, setMaintenanceEvents] = useState<MaintenanceEvent[]>([]);
  const [paretoData, setParetoData] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>({});
  const [stats, setStats] = useState(getDashboardStats());

  useEffect(() => {
    initializeDataIfNeeded();

    const refreshData = () => {
      // Use the new converter function to get maintenance events
      const events = getMaintenanceEventsFromInterventions();
      const storedParetoCauses = JSON.parse(localStorage.getItem('paretoCauses') || '[]');
      const storedMetrics = JSON.parse(localStorage.getItem('performanceMetrics') || '{}');
      
      setMaintenanceEvents(events);
      setParetoData(storedParetoCauses);
      setMetrics(storedMetrics);
      setStats(getDashboardStats());
    };

    refreshData();
    
    // Set up refresh interval to check for changes
    const refreshInterval = setInterval(refreshData, 5000);
    
    return () => {
      clearInterval(refreshInterval);
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center print:mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Tableau de bord</h1>
      </div>
      
      <div id="dashboard-content" className="print:space-y-8">
        <Tabs defaultValue="today" onValueChange={(value) => setTabValue(value as "today" | "week" | "month")} className="print:hidden">
          <TabsList>
            <TabsTrigger value="today">Aujourd'hui</TabsTrigger>
            <TabsTrigger value="week">Cette semaine</TabsTrigger>
            <TabsTrigger value="month">Ce mois</TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-6">
            <DashboardStats stats={stats} period="today" />
          </TabsContent>
          
          <TabsContent value="week" className="space-y-6">
            <DashboardStats stats={stats} period="week" />
          </TabsContent>
          
          <TabsContent value="month" className="space-y-6">
            <DashboardStats stats={stats} period="month" />
          </TabsContent>
        </Tabs>
        
        {/* Always show the current tab content when printing */}
        <div className="hidden print:block print:mb-8">
          <DashboardStats stats={stats} period={tabValue} />
        </div>
        
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 print:gap-8">
          <MaintenanceCalendar events={maintenanceEvents} />
          <RecentInterventions events={maintenanceEvents} />
        </div>
        
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3 print:gap-8 print:mt-8">
          <div className="lg:col-span-2">
            <ParetoChart data={paretoData} title="Analyse Pareto des causes de pannes" height={300} />
          </div>
          <PerformanceMetrics metrics={metrics} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
