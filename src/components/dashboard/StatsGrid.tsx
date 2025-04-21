
import { StatCard } from "@/components/dashboard/StatCard";
import { Activity, Clock, Package, Settings } from "lucide-react";

type StatsGridProps = {
  stats: any;
};

export function StatsGrid({ stats }: StatsGridProps) {
  return (
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
  );
}
