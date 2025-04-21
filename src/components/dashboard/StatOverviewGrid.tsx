
import { StatCard } from "@/components/dashboard/StatCard";
import { Activity, Clock, Package, Settings } from "lucide-react";

type StatOverviewGridProps = {
  stats: any;
  type: "week" | "month";
};

export function StatOverviewGrid({ stats, type }: StatOverviewGridProps) {
  if (type === "week") {
    return (
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
    );
  }
  // month
  return (
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
  );
}
