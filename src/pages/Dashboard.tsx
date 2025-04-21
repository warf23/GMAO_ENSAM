import { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fr } from 'date-fns/locale';
import { formatDistanceToNow } from 'date-fns';
import {
  initializeDataIfNeeded,
  getEquipmentFromStorage,
  getInterventionsFromStorage,
  getDashboardStats
} from '@/utils/dataUtils';
import { ParetoChart } from '@/components/dashboard/ParetoChart';
import { MaintenanceCalendar } from '@/components/dashboard/MaintenanceCalendar';
import { IndicateurTable } from '@/components/dashboard/indicators/IndicateurTable';
import { PdfDownloadButton } from '@/components/dashboard/PdfDownloadButton';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { RecentInterventions } from '@/components/dashboard/RecentInterventions';

const calculateIndicators = (equipmentList, interventions) => {
  // For TRS, this is a placeholder since it requires production data.
  // Here we will just use a random demo value.
  const results = equipmentList.map(eq => {
    const eqInterventions = interventions.filter(int => int.equipmentId === eq.id);
    const failures = eqInterventions.filter(int => int.type === 'corrective');
    const repairs = eqInterventions.filter(int => int.status === 'completed' && int.duration);

    // MTBF = Operating time / number of failures
    // We'll fake operation time as: now - installed date / 24h
    const installDate = new Date(eq.installationDate || Date.now() - 90 * 24 * 60 * 60 * 1000);
    const now = new Date();
    const hours = Math.max((now.getTime() - installDate.getTime()) / (1000 * 60 * 60), 1);
    const mtbf = failures.length > 0 ? (hours / failures.length).toFixed(1) : '-';

    // MTTR = Sum of repair durations / number of repairs (in hours)
    // Assuming int.duration is in hours
    const totalRepairTime = repairs.reduce((sum, int) => sum + (int.duration ?? 0), 0);
    const mttr = repairs.length > 0 ? (totalRepairTime / repairs.length).toFixed(1) : '-';

    // Demo TRS value, in %
    const trs = 80 + Math.round(Math.random() * 19);

    return {
      name: eq.name,
      mtbf,
      mttr,
      trs
    };
  });
  return results;
};

const Dashboard = () => {
  const [tabValue, setTabValue] = useState("today");
  const [maintenanceEvents, setMaintenanceEvents] = useState([]);
  const [paretoData, setParetoData] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [stats, setStats] = useState(getDashboardStats());
  const [equipment, setEquipment] = useState([]);
  const [indicators, setIndicators] = useState([]);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeDataIfNeeded();

    const refreshData = () => {
      const equipmentList = getEquipmentFromStorage();
      const interventions = getInterventionsFromStorage();
      const storedParetoCauses = JSON.parse(localStorage.getItem('paretoCauses') || '[]');
      const storedMetrics = JSON.parse(localStorage.getItem('performanceMetrics') || '{}');

      setEquipment(equipmentList);
      setMaintenanceEvents(interventions);
      setParetoData(storedParetoCauses);
      setMetrics(storedMetrics);
      setStats(getDashboardStats());
      setIndicators(calculateIndicators(equipmentList, interventions));
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
          <span className="text-sm text-muted-foreground">
            Dernière mise à jour: {formatDistanceToNow(new Date(), { addSuffix: true, locale: fr })}
          </span>
          <PdfDownloadButton reportRef={reportRef} />
        </div>
      </div>
      <div ref={reportRef} className="space-y-8">
        <StatsGrid stats={stats} />
        <IndicateurTable indicators={indicators} />
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold">Pareto des pannes</CardTitle>
          </CardHeader>
          <CardContent>
            <ParetoChart data={paretoData} title="" height={300} />
          </CardContent>
        </Card>
        <Tabs defaultValue="today" onValueChange={setTabValue} className="space-y-8">
          <TabsList className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <TabsTrigger value="today">Aujourd'hui</TabsTrigger>
            <TabsTrigger value="week">Cette semaine</TabsTrigger>
            <TabsTrigger value="month">Ce mois</TabsTrigger>
          </TabsList>
          <TabsContent value="today" className="space-y-8">
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              <Card className="col-span-1 lg:col-span-2 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base font-semibold">Calendrier des interventions</CardTitle>
                </CardHeader>
                <CardContent>
                  <MaintenanceCalendar events={maintenanceEvents} />
                </CardContent>
              </Card>
              <RecentInterventions maintenanceEvents={maintenanceEvents} />
            </div>
          </TabsContent>
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
    </div>
  );
};

export default Dashboard;
