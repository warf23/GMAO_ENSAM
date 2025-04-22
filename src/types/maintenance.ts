
export interface MaintenanceEvent {
  id: string;
  title: string;
  date: Date;
  equipmentId: string;
  equipmentName: string;
  type: 'preventive' | 'corrective';
  status: 'planned' | 'in-progress' | 'completed' | 'overdue';
  description?: string;
  assignedTo?: string;
  duration?: number;
}
