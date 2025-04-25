import { addDays, subDays } from 'date-fns';

// Types
export type Equipment = {
  id: string;
  name: string;
  type: string;
  status: 'operational' | 'maintenance' | 'breakdown';
  lastMaintenance: Date;
  nextMaintenance: Date;
};

export type Intervention = {
  id: string;
  title: string;
  date: Date;
  equipmentId: string;
  equipmentName: string;
  status: 'planned' | 'completed' | 'overdue' | 'in-progress' | 'scheduled' | 'canceled';
  type: 'preventive' | 'corrective';
  technicians?: string[];
  duration?: number;
};

export type MaintenanceEvent = Intervention;

export type ParetoItem = {
  name: string;
  value: number;
};

// Generate random equipment data
export const generateMockEquipment = (count: number = 42): Equipment[] => {
  const types = ['Pompe', 'Compresseur', 'Moteur', 'Ventilateur', 'Convoyeur'];
  const statuses: Equipment['status'][] = ['operational', 'maintenance', 'breakdown'];

  return Array.from({ length: count }, (_, i) => ({
    id: `EQ${String(i + 1).padStart(3, '0')}`,
    name: `${types[Math.floor(Math.random() * types.length)]} ${String.fromCharCode(65 + Math.floor(i / 10))}${i % 10 + 1}`,
    type: types[Math.floor(Math.random() * types.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    lastMaintenance: subDays(new Date(), Math.floor(Math.random() * 30)),
    nextMaintenance: addDays(new Date(), Math.floor(Math.random() * 30)),
  }));
};

// Generate random interventions
export const generateMockInterventions = (equipment: Equipment[]): Intervention[] => {
  const interventionTypes = ['Maintenance préventive', 'Remplacement', 'Réparation', 'Inspection'];
  const statuses: Intervention['status'][] = ['planned', 'completed', 'overdue', 'in-progress', 'scheduled', 'canceled'];
  const types: Intervention['type'][] = ['preventive', 'corrective'];

  return equipment.flatMap((eq) => {
    const interventionCount = Math.floor(Math.random() * 3) + 1;
    return Array.from({ length: interventionCount }, (_, i) => ({
      id: `INT${eq.id}${i}`,
      title: `${interventionTypes[Math.floor(Math.random() * interventionTypes.length)]} - ${eq.name}`,
      date: Math.random() > 0.5 ? subDays(new Date(), Math.floor(Math.random() * 7)) : addDays(new Date(), Math.floor(Math.random() * 7)),
      equipmentId: eq.id,
      equipmentName: eq.name,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      type: types[Math.floor(Math.random() * types.length)],
      technicians: Math.random() > 0.5 ? [Math.random().toString(36).substr(2, 5)] : undefined,
      duration: Math.random() > 0.5 ? Math.floor(Math.random() * 10) + 1 : undefined,
    }));
  });
};

// Generate Pareto data for failures
export const generateParetoCauses = (): ParetoItem[] => {
  const causes = [
    { name: 'Panne électrique', baseValue: 35 },
    { name: 'Usure mécanique', baseValue: 25 },
    { name: 'Défaut lubrification', baseValue: 18 },
    { name: 'Erreur opérateur', baseValue: 12 },
    { name: 'Problème hydraulique', baseValue: 8 },
    { name: 'Autres', baseValue: 5 },
  ];

  return causes.map(cause => ({
    name: cause.name,
    value: Math.max(1, Math.floor(cause.baseValue * (0.8 + Math.random() * 0.4))), // ±20% variation
  }));
};

// Generate performance indicators
export const generatePerformanceMetrics = () => ({
  trs: Math.round((70 + Math.random() * 20) * 10) / 10, // 70-90%
  mtbf: Math.round(100 + Math.random() * 50), // 100-150 hours
  mttr: Math.round((1 + Math.random() * 3) * 10) / 10, // 1-4 hours
});

// Initialize mock data in localStorage if not present
export const initializeMockData = () => {
  if (!localStorage.getItem('mockDataInitialized')) {
    const equipment = generateMockEquipment();
    const interventions = generateMockInterventions(equipment);
    
    // Make sure to store dates as ISO strings
    localStorage.setItem('equipment', JSON.stringify(equipment, (key, value) => {
      if (value instanceof Date) {
        return value.toISOString();
      }
      return value;
    }));
    localStorage.setItem('interventions', JSON.stringify(interventions, (key, value) => {
      if (value instanceof Date) {
        return value.toISOString();
      }
      return value;
    }));
    localStorage.setItem('mockDataInitialized', 'true');
  }
};

// Update mock data periodically (every 30 seconds)
export const setupMockDataUpdates = () => {
  const updateData = () => {
    const equipment = generateMockEquipment();
    const interventions = generateMockInterventions(equipment);
    const paretoCauses = generateParetoCauses();
    const performanceMetrics = generatePerformanceMetrics();

    // Make sure to store dates as ISO strings
    localStorage.setItem('equipment', JSON.stringify(equipment, (key, value) => {
      if (value instanceof Date) {
        return value.toISOString();
      }
      return value;
    }));
    localStorage.setItem('interventions', JSON.stringify(interventions, (key, value) => {
      if (value instanceof Date) {
        return value.toISOString();
      }
      return value;
    }));
    localStorage.setItem('paretoCauses', JSON.stringify(paretoCauses));
    localStorage.setItem('performanceMetrics', JSON.stringify(performanceMetrics));
  };

  // Update immediately
  updateData();
  
  // Then update every 30 seconds
  const interval = setInterval(updateData, 30000);
  
  // Cleanup function
  return () => clearInterval(interval);
};
