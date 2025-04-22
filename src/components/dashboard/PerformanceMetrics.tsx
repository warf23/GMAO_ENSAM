
import { PerformanceIndicator } from './PerformanceIndicator';

type PerformanceMetricsProps = {
  metrics: {
    trs?: number;
    mtbf?: number;
    mttr?: number;
  };
};

export const PerformanceMetrics = ({ metrics }: PerformanceMetricsProps) => {
  return (
    <div className="space-y-6">
      <PerformanceIndicator 
        title="TRS (Taux de rendement synthétique)" 
        value={metrics.trs || 0} 
        target={85}
        unit="%"
        description="Disponibilité × Performance × Qualité"
        status={(metrics.trs || 0) >= 85 ? 'success' : 'warning'}
      />
      <PerformanceIndicator 
        title="MTBF (Temps moyen entre pannes)" 
        value={metrics.mtbf || 0} 
        target={150}
        unit="heures"
        description="Fiabilité des équipements"
        status={(metrics.mtbf || 0) >= 150 ? 'success' : 'warning'}
      />
      <PerformanceIndicator 
        title="MTTR (Temps moyen de réparation)" 
        value={metrics.mttr || 0} 
        target={3}
        unit="heures"
        description="Durée moyenne des interventions"
        status={(metrics.mttr || 0) <= 3 ? 'success' : 'warning'}
      />
    </div>
  );
};
