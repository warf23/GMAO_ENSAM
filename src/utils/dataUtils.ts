import { toast } from "sonner";
import { SparePart } from "@/types/sparePart";
import { MaintenanceEvent } from "@/types/maintenance";
import { Equipment, Intervention, generateMockEquipment, generateMockInterventions, generatePerformanceMetrics, generateParetoCauses } from "@/utils/mockData";

// Helper to get data from localStorage with proper parsing for dates
export const getEquipmentFromStorage = (): Equipment[] => {
  const data = localStorage.getItem('equipment');
  if (!data) return [];
  
  try {
    return JSON.parse(data, (key, value) => {
      if (key === 'lastMaintenance' || key === 'nextMaintenance') {
        return new Date(value);
      }
      return value;
    });
  } catch (e) {
    console.error('Error parsing equipment data:', e);
    return [];
  }
};

// Convert interventions to maintenance events format for the dashboard
export const getMaintenanceEventsFromInterventions = (): MaintenanceEvent[] => {
  const interventions = getInterventionsFromStorage();
  
  return interventions.map(intervention => {
    let status: 'planned' | 'in-progress' | 'completed' | 'overdue' = 'planned';
    
    if (intervention.status === 'completed') {
      status = 'completed';
    } else if (intervention.status === 'in-progress') {
      status = 'in-progress';
    } else if (intervention.status === 'scheduled') {
      const now = new Date();
      const startDate = new Date(intervention.startDate);
      
      if (startDate < now) {
        status = 'overdue';
      } else {
        status = 'planned';
      }
    } else if (intervention.status === 'canceled') {
      return null;
    }
    
    return {
      id: intervention.id,
      title: intervention.title,
      date: new Date(intervention.startDate),
      equipmentId: intervention.equipmentId,
      equipmentName: intervention.equipmentName || 'Équipement inconnu',
      type: intervention.type === 'preventive' ? 'preventive' : 'corrective',
      status: status,
      description: intervention.description,
      assignedTo: intervention.technicians ? intervention.technicians.join(', ') : undefined,
      duration: intervention.duration
    };
  }).filter(Boolean) as MaintenanceEvent[];
};

export const getInterventionsFromStorage = (): Intervention[] => {
  const data = localStorage.getItem('interventions');
  if (!data) return [];
  
  try {
    return JSON.parse(data, (key, value) => {
      if (key === 'date') {
        return new Date(value);
      }
      return value;
    });
  } catch (e) {
    console.error('Error parsing interventions data:', e);
    return [];
  }
};

export const getSparePartsFromStorage = (): SparePart[] => {
  const data = localStorage.getItem('spareParts');
  if (!data) return [];
  
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error('Error parsing spare parts data:', e);
    return [];
  }
};

// Delete operations
export const deleteEquipment = (id: string): void => {
  const equipment = getEquipmentFromStorage();
  const interventions = getInterventionsFromStorage();
  
  const updatedEquipment = equipment.filter(eq => eq.id !== id);
  const updatedInterventions = interventions.filter(int => int.equipmentId !== id);
  
  localStorage.setItem('equipment', JSON.stringify(updatedEquipment));
  localStorage.setItem('interventions', JSON.stringify(updatedInterventions));
  
  const metrics = generatePerformanceMetrics();
  localStorage.setItem('performanceMetrics', JSON.stringify(metrics));
  
  const paretoCauses = generateParetoCauses();
  localStorage.setItem('paretoCauses', JSON.stringify(paretoCauses));
  
  toast.success("Équipement supprimé avec succès");
};

export const deleteIntervention = (id: string): void => {
  const interventions = getInterventionsFromStorage();
  const updatedInterventions = interventions.filter(int => int.id !== id);
  
  localStorage.setItem('interventions', JSON.stringify(updatedInterventions));
  
  const metrics = generatePerformanceMetrics();
  localStorage.setItem('performanceMetrics', JSON.stringify(metrics));
  
  toast.success("Intervention supprimée avec succès");
};

export const deleteSparePart = (id: string): void => {
  const spareParts = getSparePartsFromStorage();
  const updatedSpareParts = spareParts.filter(part => part.id !== id);
  
  localStorage.setItem('spareParts', JSON.stringify(updatedSpareParts));
  
  toast.success("Pièce détachée supprimée avec succès");
};

// Initialize data if not present
export const initializeDataIfNeeded = (): void => {
  if (!localStorage.getItem('equipment')) {
    const equipment = generateMockEquipment();
    localStorage.setItem('equipment', JSON.stringify(equipment, (key, value) => {
      if (value instanceof Date) {
        return value.toISOString();
      }
      return value;
    }));
  }
  
  if (!localStorage.getItem('interventions')) {
    const equipment = getEquipmentFromStorage();
    const interventions = generateMockInterventions(equipment);
    localStorage.setItem('interventions', JSON.stringify(interventions, (key, value) => {
      if (value instanceof Date) {
        return value.toISOString();
      }
      return value;
    }));
  }
  
  if (!localStorage.getItem('spareParts') || JSON.parse(localStorage.getItem('spareParts') || '[]').length === 0) {
    const initialSpareParts: SparePart[] = [
      {
        id: "PDR001",
        reference: "ROU-123",
        name: "Roulement à billes",
        description: "Roulement à billes pour moteur électrique",
        supplier: "SKF",
        currentStock: 15,
        minimumStock: 5,
        unitPrice: 45.99,
        location: "Étagère A-12",
        category: "Mécanique",
        lastRestockDate: new Date().toISOString().split('T')[0],
      },
      {
        id: "PDR002",
        reference: "BELT-456",
        name: "Courroie de transmission",
        description: "Courroie de transmission pour convoyeur",
        supplier: "Gates",
        currentStock: 3,
        minimumStock: 4,
        unitPrice: 78.50,
        location: "Étagère B-03",
        category: "Transmission",
        lastRestockDate: new Date().toISOString().split('T')[0],
      },
      {
        id: "PDR003",
        reference: "FIL-789",
        name: "Filtre à huile",
        description: "Filtre à huile pour compresseur",
        supplier: "Parker",
        currentStock: 8,
        minimumStock: 6,
        unitPrice: 22.75,
        location: "Étagère C-08",
        category: "Filtration",
        lastRestockDate: new Date().toISOString().split('T')[0],
      },
    ];
    
    localStorage.setItem('spareParts', JSON.stringify(initialSpareParts));
  }
  
  if (!localStorage.getItem('performanceMetrics')) {
    const metrics = generatePerformanceMetrics();
    localStorage.setItem('performanceMetrics', JSON.stringify(metrics));
  }
  
  if (!localStorage.getItem('paretoCauses')) {
    const paretoCauses = generateParetoCauses();
    localStorage.setItem('paretoCauses', JSON.stringify(paretoCauses));
  }
};

// Get dashboard statistics
export const getDashboardStats = () => {
  const equipment = getEquipmentFromStorage();
  const interventions = getInterventionsFromStorage();
  const spareParts = getSparePartsFromStorage();
  
  return {
    totalEquipment: equipment.length,
    equipmentInBreakdown: equipment.filter(eq => eq.status === 'breakdown').length,
    totalInterventions: interventions.length,
    activeInterventions: interventions.filter(int => int.status !== 'completed').length,
    preventiveInterventions: interventions.filter(int => int.type === 'preventive').length,
    correctiveInterventions: interventions.filter(int => int.type === 'corrective').length,
    plannedInterventions: interventions.filter(int => int.status === 'planned').length,
    lowStockParts: spareParts.filter(part => part.currentStock <= part.minimumStock).length,
  };
};
