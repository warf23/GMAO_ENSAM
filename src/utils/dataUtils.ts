
import { toast } from "sonner";
import { SparePart } from "@/types/sparePart";
import { Equipment, Intervention, generateMockEquipment, generateMockInterventions, generatePerformanceMetrics, generateParetoCauses } from "@/utils/mockData";

// Helper to get data from localStorage with proper parsing for dates
export const getEquipmentFromStorage = (): Equipment[] => {
  const data = localStorage.getItem('equipment');
  if (!data) return [];
  
  try {
    return JSON.parse(data, (key, value) => {
      // Convert ISO date strings back to Date objects for specific fields
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

export const getInterventionsFromStorage = (): Intervention[] => {
  const data = localStorage.getItem('interventions');
  if (!data) return [];
  
  try {
    return JSON.parse(data, (key, value) => {
      // Convert ISO date strings back to Date objects
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
  
  // Filter out the equipment to delete
  const updatedEquipment = equipment.filter(eq => eq.id !== id);
  
  // Also remove related interventions
  const updatedInterventions = interventions.filter(int => int.equipmentId !== id);
  
  // Save back to localStorage
  localStorage.setItem('equipment', JSON.stringify(updatedEquipment));
  localStorage.setItem('interventions', JSON.stringify(updatedInterventions));
  
  // Update performance metrics based on new data
  const metrics = generatePerformanceMetrics();
  localStorage.setItem('performanceMetrics', JSON.stringify(metrics));
  
  // Update Pareto causes based on new data
  const paretoCauses = generateParetoCauses();
  localStorage.setItem('paretoCauses', JSON.stringify(paretoCauses));
  
  toast.success("Équipement supprimé avec succès");
};

export const deleteIntervention = (id: string): void => {
  const interventions = getInterventionsFromStorage();
  const updatedInterventions = interventions.filter(int => int.id !== id);
  
  localStorage.setItem('interventions', JSON.stringify(updatedInterventions));
  
  // Update metrics after deletion
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
    // Create some initial spare parts if none exist
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
  
  // Make sure performance metrics and Pareto causes are initialized
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
