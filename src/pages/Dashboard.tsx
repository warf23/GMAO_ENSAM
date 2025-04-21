
import { useState, useEffect, useRef } from 'react';
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
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Button } from "@/components/ui/button";

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
    const hours = Math.max((now - installDate) / (1000 * 60 * 60), 1);
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
    // Initialize mock data if needed
    initializeDataIfNeeded();

    // Load initial data
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

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;

    const doc = new jsPDF("p", "mm", "a4");
    const scale = 2;
    const input = reportRef.current;
    const canvas = await html2canvas(input, { scale, backgroundColor: "#fff" });

    const imgData = canvas.toDataURL("image/png");
    const pdfWidth = 210, pdfHeight = 297; // mm (A4)
    const imgProps = doc.getImageProperties(imgData);
    const imgWidth = pdfWidth;
    const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
    doc.addImage(imgData, "PNG", 0, 0, imgWidth, Math.min(imgHeight, pdfHeight - 10));
    doc.save("rapport-tableau-de-bord.pdf");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Tableau de bord</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Dernière mise à jour: {formatDistanceToNow(new Date(), { addSuffix: true, locale: fr })}</span>
          <Button onClick={handleDownloadPDF} variant="outline">
            Télécharger le rapport PDF
          </Button>
        </div>
      </div>
      <div ref={reportRef} className="space-y-8">
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

        {/* Perf Indicators */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Indicateurs de performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border rounded-lg shadow text-sm mt-2">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-3 text-left font-semibold">Équipement</th>
                    <th className="p-3 text-left font-semibold">MTBF (h)</th>
                    <th className="p-3 text-left font-semibold">MTTR (h)</th>
                    <th className="p-3 text-left font-semibold">TRS (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {indicators.map(ind => (
                    <tr className="border-b" key={ind.name}>
                      <td className="px-3 py-2">{ind.name}</td>
                      <td className="px-3 py-2">{ind.mtbf}</td>
                      <td className="px-3 py-2">{ind.mttr}</td>
                      <td className="px-3 py-2">{ind.trs}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

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
            </div>
          </TabsContent>

          {/* Week and Month tabs content - same as before, no change */}
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

