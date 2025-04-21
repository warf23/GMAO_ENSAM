import { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { fr } from 'date-fns/locale';
import { formatDistanceToNow } from 'date-fns';
import {
  initializeDataIfNeeded,
  getEquipmentFromStorage,
  getInterventionsFromStorage,
  getDashboardStats
} from '@/utils/dataUtils';
import { ParetoChart } from '@/components/dashboard/ParetoChart';
import { IndicateurTable } from '@/components/dashboard/indicators/IndicateurTable';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";

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
        <DashboardTabs stats={stats} maintenanceEvents={maintenanceEvents} />
      </div>
    </div>
  );
};

export default Dashboard;
