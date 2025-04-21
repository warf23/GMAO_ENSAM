import { useState, useEffect } from 'react';
import { Activity, Clock, Package, Settings, Wrench } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { ParetoChart } from '@/components/dashboard/ParetoChart';
import { MaintenanceCalendar } from '@/components/dashboard/MaintenanceCalendar';
import { PerformanceIndicator } from '@/components/dashboard/PerformanceIndicator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  initializeDataIfNeeded,
  getEquipmentFromStorage,
  getInterventionsFromStorage,
  getDashboardStats
} from '@/utils/dataUtils';

const Dashboard = () => {
  const [tabValue, setTabValue] = useState("today");
  const [maintenanceEvents, setMaintenanceEvents] = useState([]);
  const [paretoData, setParetoData] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [stats, setStats] = useState(getDashboardStats());

  useEffect(() => {
    // Initialize mock data if needed
    initializeDataIfNeeded();

    // Load initial data
    const refreshData = () => {
      const interventions = getInterventionsFromStorage();
      const storedParetoCauses = JSON.parse(localStorage.getItem('paretoCauses') || '[]');
      const storedMetrics = JSON.parse(localStorage.getItem('performanceMetrics') || '{}');
      
      setMaintenanceEvents(interventions);
      setParetoData(storedParetoCauses);
      setMetrics(storedMetrics);
      setStats(getDashboardStats());
    };

    refreshData();
    const refreshInterval = setInterval(refreshData, 5000);
    return () => clearInterval(refreshInterval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Tableau de bord</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Dernière mise à jour: {formatDistanceToNow(new Date(), { addSuffix: true, locale: fr })}</span>
        </div>
      </div>
      
      <Tabs defaultValue="today" onValueChange={setTabValue} className="space-y-8">
        <TabsList className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <TabsTrigger value="today">Aujourd'hui</TabsTrigger>
          <TabsTrigger value="week">Cette semaine</TabsTrigger>
          <TabsTrigger value="month">Ce mois</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-8">
          {/* Stats Cards Grid */}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Interventions en cours"
              value={String(stats.activeInterventions)}
              description={`${stats.preventiveInterventions} préventives, ${stats.correctiveInterventions} correctives`}
              icon={Activity}
              trend="up"
              trendValue="+2 aujourd'hui"
              iconClassName="bg-blue-500/10 text-blue-500"
            />
            <StatCard
              title="En attente"
              value={String(stats.plannedInterventions)}
              description="Interventions planifiées"
              icon={Clock}
              trend="neutral"
              trendValue="inchangé"
              iconClassName="bg-orange-500/10 text-orange-500"
            />
            <StatCard
              title="Equipements en panne"
              value={String(stats.equipmentInBreakdown)}
              description={`Sur ${stats.totalEquipment} équipements`}
              icon={Settings}
              trend="down"
              trendValue="-1 depuis hier"
              iconClassName="bg-red-500/10 text-red-500"
            />
            <StatCard
              title="Stock critique"
              value={String(stats.lowStockParts)}
              description="Pièces sous le seuil"
              icon={Package}
              trend="up"
              trendValue="+1 aujourd'hui"
              iconClassName="bg-purple-500/10 text-purple-500"
            />
          </div>

          {/* Calendar and Recent Interventions */}
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <Card className="col-span-1 lg:col-span-2 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-semibold">Calendrier des interventions</CardTitle>
              </CardHeader>
              <CardContent>
                <MaintenanceCalendar events={maintenanceEvents} />
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Wrench size={18} />
                  Dernières interventions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {maintenanceEvents.slice(0, 3).map((event) => (
                    <div key={event.id} className="flex items-start space-x-3 pb-3 border-b last:border-b-0 last:pb-0">
                      <div className={`h-9 w-9 rounded-full flex items-center justify-center ${
                        event.status === 'completed' ? 'bg-green-500/10 text-green-500' : 
                        event.status === 'overdue' ? 'bg-red-500/10 text-red-500' : 
                        'bg-blue-500/10 text-blue-500'
                      }`}>
                        {event.type === 'preventive' ? <Settings size={16} /> : <Wrench size={16} />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-sm">{event.title}</p>
                            <p className="text-xs text-muted-foreground">{event.equipmentName}</p>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(event.date), { addSuffix: true, locale: fr })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Analyse des pannes</CardTitle>
              </CardHeader>
              <CardContent>
                <ParetoChart data={paretoData} title="" height={300} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Week and Month tabs content - similar structure to Today */}
        <TabsContent value="week" className="space-y-8">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Interventions totales"
              value={String(stats.totalInterventions)}
              description={`${stats.preventiveInterventions} préventives, ${stats.correctiveInterventions} correctives`}
              icon={Activity}
              trend="up"
              trendValue="+5 cette semaine"
              iconClassName="bg-primary/10 text-primary"
            />
            <StatCard
              title="En attente"
              value={String(stats.plannedInterventions)}
              description="Interventions planifiées"
              icon={Clock}
              trend="up"
              trendValue="+2 cette semaine"
              iconClassName="bg-warning/10 text-warning"
            />
            <StatCard
              title="Equipements en panne"
              value={String(stats.equipmentInBreakdown)}
              description={`Sur ${stats.totalEquipment} équipements`}
              icon={Settings}
              trend="down"
              trendValue="-3 cette semaine"
              iconClassName="bg-destructive/10 text-destructive"
            />
            <StatCard
              title="Stock critique"
              value={String(stats.lowStockParts)}
              description="Pièces sous le seuil"
              icon={Package}
              trend="neutral"
              trendValue="inchangé"
              iconClassName="bg-warning/10 text-warning"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="month" className="space-y-8">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Interventions totales"
              value={String(stats.totalInterventions)}
              description={`${stats.preventiveInterventions} préventives, ${stats.correctiveInterventions} correctives`}
              icon={Activity}
              trend="down"
              trendValue="-8 vs mois dernier"
              iconClassName="bg-primary/10 text-primary"
            />
            <StatCard
              title="En attente"
              value={String(stats.plannedInterventions)}
              description="Interventions planifiées"
              icon={Clock}
              trend="up"
              trendValue="+3 ce mois"
              iconClassName="bg-warning/10 text-warning"
            />
            <StatCard
              title="Equipements en panne"
              value={String(stats.equipmentInBreakdown)}
              description={`Sur ${stats.totalEquipment} équipements`}
              icon={Settings}
              trend="down"
              trendValue="-5 ce mois"
              iconClassName="bg-destructive/10 text-destructive"
            />
            <StatCard
              title="Stock critique"
              value={String(stats.lowStockParts)}
              description="Pièces sous le seuil"
              icon={Package}
              trend="down"
              trendValue="-2 ce mois"
              iconClassName="bg-warning/10 text-warning"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
