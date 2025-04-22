
import { Activity, Clock, Package, Settings } from 'lucide-react';
import { StatCard } from './StatCard';

type DashboardStatsProps = {
  stats: {
    activeInterventions: number;
    preventiveInterventions: number;
    correctiveInterventions: number;
    plannedInterventions: number;
    equipmentInBreakdown: number;
    totalEquipment: number;
    lowStockParts: number;
    totalInterventions: number;
  };
  period: 'today' | 'week' | 'month';
};

export const DashboardStats = ({ stats, period }: DashboardStatsProps) => {
  const getTrendValue = () => {
    switch (period) {
      case 'today':
        return {
          interventions: '+2 aujourd\'hui',
          planned: 'inchangé',
          equipment: '-1 depuis hier',
          stock: '+1 aujourd\'hui'
        };
      case 'week':
        return {
          interventions: '+5 cette semaine',
          planned: '+2 cette semaine',
          equipment: '-3 cette semaine',
          stock: 'inchangé'
        };
      case 'month':
        return {
          interventions: '-8 vs mois dernier',
          planned: '+3 ce mois',
          equipment: '-5 ce mois',
          stock: '-2 ce mois'
        };
    }
  };

  const trends = getTrendValue();

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Interventions en cours"
        value={String(stats.activeInterventions)}
        description={`${stats.preventiveInterventions} préventives, ${stats.correctiveInterventions} correctives`}
        icon={Activity}
        trend="up"
        trendValue={trends.interventions}
        iconClassName="bg-primary/10 text-primary"
      />
      <StatCard
        title="En attente"
        value={String(stats.plannedInterventions)}
        description="Interventions planifiées"
        icon={Clock}
        trend="neutral"
        trendValue={trends.planned}
        iconClassName="bg-warning/10 text-warning"
      />
      <StatCard
        title="Equipements en panne"
        value={String(stats.equipmentInBreakdown)}
        description={`Sur ${stats.totalEquipment} équipements`}
        icon={Settings}
        trend="down"
        trendValue={trends.equipment}
        iconClassName="bg-destructive/10 text-destructive"
      />
      <StatCard
        title="Stock critique"
        value={String(stats.lowStockParts)}
        description="Pièces sous le seuil"
        icon={Package}
        trend="up"
        trendValue={trends.stock}
        iconClassName="bg-warning/10 text-warning"
      />
    </div>
  );
};
