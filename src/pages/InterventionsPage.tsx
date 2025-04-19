import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  AlertCircle, Calendar, CheckCircle, ChevronsUpDown, 
  Filter, Plus, Search, Sparkles, Timer, Wrench
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, isAfter, isBefore, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import { InterventionFormDialog } from '@/components/interventions/InterventionFormDialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Types for interventions
type InterventionStatus = 'completed' | 'in-progress' | 'scheduled' | 'canceled';
type InterventionType = 'corrective' | 'preventive';

type Intervention = {
  id: string;
  title: string;
  description: string;
  equipmentId: string;
  equipmentName?: string;
  type: InterventionType;
  status: InterventionStatus;
  priority: 'low' | 'medium' | 'high' | 'critical';
  startDate: string;
  endDate: string | null;
  duration?: number | null; // in minutes
  technicians: string[];
  causesOfFailure?: string[];
  spareParts?: {
    id: string;
    name: string;
    quantity: number;
  }[];
};

// Mock equipment data for testing
const mockEquipment = [
  { id: 'eq001', name: 'Pompe centrifuge P-101' },
  { id: 'eq002', name: 'Compresseur C-201' },
  { id: 'eq003', name: 'Moteur électrique M-301' },
];

const InterventionsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  
  // Load interventions from localStorage
  const loadInterventions = () => {
    // Get interventions from localStorage
    const storedInterventions = localStorage.getItem('interventions');
    
    if (storedInterventions) {
      let parsedInterventions = JSON.parse(storedInterventions);
      
      // Add equipment names to interventions if missing
      parsedInterventions = parsedInterventions.map((intervention: Intervention) => {
        if (!intervention.equipmentName) {
          const equipment = mockEquipment.find(eq => eq.id === intervention.equipmentId);
          return {
            ...intervention,
            equipmentName: equipment ? equipment.name : 'Équipement inconnu'
          };
        }
        return intervention;
      });
      
      setInterventions(parsedInterventions);
    } else {
      // Use mock data if no interventions in localStorage
      const mockInterventions: Intervention[] = [
        {
          id: 'int001',
          title: 'Maintenance préventive trimestrielle',
          description: 'Vérification complète et graissage',
          equipmentId: 'eq001',
          equipmentName: 'Pompe centrifuge P-101',
          type: 'preventive',
          status: 'scheduled',
          priority: 'medium',
          startDate: '2024-05-20T09:00:00',
          endDate: null,
          duration: 120,
          technicians: ['Marie Dubois'],
        },
        {
          id: 'int002',
          title: 'Remplacement joints d\'étanchéité',
          description: 'Fuites détectées au niveau des joints. Remplacement nécessaire.',
          equipmentId: 'eq001',
          equipmentName: 'Pompe centrifuge P-101',
          type: 'corrective',
          status: 'completed',
          priority: 'high',
          startDate: '2024-04-05T13:30:00',
          endDate: '2024-04-05T15:45:00',
          duration: 135,
          technicians: ['Jean Dupont', 'Sarah Martin'],
          causesOfFailure: ['Usure', 'Vibration excessive'],
          spareParts: [
            { id: 'sp001', name: 'Joint d\'étanchéité', quantity: 2 },
            { id: 'sp002', name: 'Roulement à billes', quantity: 1 },
          ],
        },
        {
          id: 'int003',
          title: 'Calibration capteurs de pression',
          description: 'Calibration des capteurs de pression selon normes du fabricant',
          equipmentId: 'eq002',
          equipmentName: 'Compresseur C-201',
          type: 'preventive',
          status: 'completed',
          priority: 'low',
          startDate: '2024-04-15T10:00:00',
          endDate: '2024-04-15T11:30:00',
          duration: 90,
          technicians: ['Pierre Lefebvre'],
        },
        {
          id: 'int004',
          title: 'Réparation système de refroidissement',
          description: 'Surchauffe détectée. Vérification du circuit de refroidissement et réparation.',
          equipmentId: 'eq002',
          equipmentName: 'Compresseur C-201',
          type: 'corrective',
          status: 'in-progress',
          priority: 'critical',
          startDate: '2024-04-19T08:00:00',
          endDate: null,
          duration: null,
          technicians: ['Jean Dupont', 'Marie Dubois'],
          causesOfFailure: ['Fuite liquide refroidissement', 'Ventilateur défectueux'],
          spareParts: [
            { id: 'sp003', name: 'Ventilateur 120mm', quantity: 1 },
            { id: 'sp004', name: 'Tuyau flexible 8mm', quantity: 2 },
          ],
        },
        {
          id: 'int005',
          title: 'Maintenance préventive mensuelle',
          description: 'Inspection visuelle et nettoyage',
          equipmentId: 'eq003',
          equipmentName: 'Moteur électrique M-301',
          type: 'preventive',
          status: 'scheduled',
          priority: 'medium',
          startDate: '2024-05-05T14:00:00',
          endDate: null,
          duration: 60,
          technicians: ['Sarah Martin'],
        },
        {
          id: 'int006',
          title: 'Remplacement roulements',
          description: 'Bruit anormal détecté. Remplacement des roulements usés.',
          equipmentId: 'eq003',
          equipmentName: 'Moteur électrique M-301',
          type: 'corrective',
          status: 'scheduled',
          priority: 'high',
          startDate: '2024-04-25T09:30:00',
          endDate: null,
          duration: 180,
          technicians: ['Pierre Lefebvre', 'Jean Dupont'],
          causesOfFailure: ['Usure des roulements'],
          spareParts: [
            { id: 'sp002', name: 'Roulement à billes', quantity: 2 },
            { id: 'sp005', name: 'Graisse haute température', quantity: 1 },
          ],
        },
      ];
      
      // Save mock data to localStorage on first load
      localStorage.setItem('interventions', JSON.stringify(mockInterventions));
      setInterventions(mockInterventions);
    }
  };
  
  // Load interventions on component mount
  useEffect(() => {
    loadInterventions();
  }, []);
  
  // Filter interventions based on search term and filters
  const filteredInterventions = interventions.filter((intervention) => {
    // Search term filter
    const matchesSearch = 
      intervention.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (intervention.equipmentName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      intervention.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Type filter
    const matchesType = typeFilter === 'all' || intervention.type === typeFilter;
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || intervention.status === statusFilter;
    
    // Priority filter
    const matchesPriority = priorityFilter === 'all' || intervention.priority === priorityFilter;
    
    return matchesSearch && matchesType && matchesStatus && matchesPriority;
  });
  
  // Sort interventions: scheduled and in-progress first, then by start date (most recent first)
  const sortedInterventions = [...filteredInterventions].sort((a, b) => {
    // First sort by status priority (in-progress, scheduled, completed)
    const statusOrder = {
      'in-progress': 0,
      'scheduled': 1,
      'completed': 2,
      'canceled': 3,
    };
    
    const statusDiff = statusOrder[a.status] - statusOrder[b.status];
    if (statusDiff !== 0) return statusDiff;
    
    // Then sort by start date (most recent first)
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });
  
  const getStatusBadge = (status: InterventionStatus) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-success">
            <CheckCircle className="mr-1 h-3 w-3" />
            Terminé
          </Badge>
        );
      case 'in-progress':
        return (
          <Badge className="bg-warning">
            <Timer className="mr-1 h-3 w-3" />
            En cours
          </Badge>
        );
      case 'scheduled':
        return (
          <Badge className="bg-primary">
            <Calendar className="mr-1 h-3 w-3" />
            Planifié
          </Badge>
        );
      case 'canceled':
        return (
          <Badge className="bg-destructive">
            <AlertCircle className="mr-1 h-3 w-3" />
            Annulé
          </Badge>
        );
      default:
        return <Badge>Inconnu</Badge>;
    }
  };
  
  const getTypeBadge = (type: InterventionType) => {
    switch (type) {
      case 'preventive':
        return (
          <Badge className="bg-primary/10 text-primary">
            <Sparkles className="mr-1 h-3 w-3" />
            Préventif
          </Badge>
        );
      case 'corrective':
        return (
          <Badge className="bg-warning/10 text-warning">
            <Wrench className="mr-1 h-3 w-3" />
            Correctif
          </Badge>
        );
      default:
        return <Badge>Inconnu</Badge>;
    }
  };
  
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return (
          <span className="text-destructive text-xs font-medium flex items-center">
            <AlertCircle className="mr-1 h-3 w-3" />
            Critique
          </span>
        );
      case 'high':
        return <span className="text-warning text-xs font-medium">Haute</span>;
      case 'medium':
        return <span className="text-primary text-xs font-medium">Moyenne</span>;
      case 'low':
        return <span className="text-success text-xs font-medium">Basse</span>;
      default:
        return <span className="text-xs">Inconnue</span>;
    }
  };
  
  const isOverdue = (intervention: Intervention) => {
    if (intervention.status === 'completed' || intervention.status === 'canceled') {
      return false;
    }
    
    const now = new Date();
    const startDate = new Date(intervention.startDate);
    
    return isBefore(startDate, now) && (intervention.status !== 'in-progress');
  };
  
  const handleCreateIntervention = () => {
    toast.success("Fonctionnalité à venir", {
      description: "La création d'interventions sera disponible prochainement.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Interventions</h1>
          <p className="text-muted-foreground">Gérez et suivez les interventions de maintenance</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Vue calendrier
          </Button>
          <InterventionFormDialog onInterventionSaved={loadInterventions} />
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher une intervention..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="preventive">Préventif</SelectItem>
              <SelectItem value="corrective">Correctif</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="in-progress">En cours</SelectItem>
              <SelectItem value="scheduled">Planifié</SelectItem>
              <SelectItem value="completed">Terminé</SelectItem>
              <SelectItem value="canceled">Annulé</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Priorité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes priorités</SelectItem>
              <SelectItem value="critical">Critique</SelectItem>
              <SelectItem value="high">Haute</SelectItem>
              <SelectItem value="medium">Moyenne</SelectItem>
              <SelectItem value="low">Basse</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon" className="flex-shrink-0">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="px-6 py-4">
          <CardTitle className="text-base font-medium">Liste des interventions ({sortedInterventions.length})</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <div className="border-t">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="py-3 px-6 text-left text-sm font-medium text-muted-foreground">
                    <div className="flex items-center gap-1">
                      Intervention
                      <ChevronsUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="py-3 px-6 text-left text-sm font-medium text-muted-foreground hidden md:table-cell">
                    Équipement
                  </th>
                  <th className="py-3 px-6 text-left text-sm font-medium text-muted-foreground">
                    Type & Statut
                  </th>
                  <th className="py-3 px-6 text-left text-sm font-medium text-muted-foreground">
                    Date
                  </th>
                  <th className="py-3 px-6 text-left text-sm font-medium text-muted-foreground hidden lg:table-cell">
                    Priorité
                  </th>
                  <th className="py-3 px-6 text-left text-sm font-medium text-muted-foreground hidden lg:table-cell">
                    Techniciens
                  </th>
                  <th className="py-3 px-6 text-right text-sm font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedInterventions.map((intervention) => (
                  <tr 
                    key={intervention.id} 
                    className={`border-b hover:bg-muted/30 ${
                      isOverdue(intervention) ? 'bg-destructive/5' : ''
                    }`}
                  >
                    <td className="py-3 px-6">
                      <div className="font-medium">
                        <Link 
                          to={`/maintenance/interventions/${intervention.id}`} 
                          className="text-primary hover:underline"
                        >
                          {intervention.title}
                        </Link>
                        {isOverdue(intervention) && (
                          <span className="ml-2 text-xs text-destructive font-medium">
                            En retard
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 line-clamp-1">
                        {intervention.description}
                      </div>
                    </td>
                    <td className="py-3 px-6 hidden md:table-cell">
                      <Link to={`/equipements/${intervention.equipmentId}`} className="text-sm hover:underline">
                        {intervention.equipmentName}
                      </Link>
                    </td>
                    <td className="py-3 px-6">
                      <div className="flex flex-col gap-1">
                        {getTypeBadge(intervention.type)}
                        {getStatusBadge(intervention.status)}
                      </div>
                    </td>
                    <td className="py-3 px-6">
                      <div className="text-sm">
                        {format(new Date(intervention.startDate), 'dd/MM/yyyy', { locale: fr })}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(intervention.startDate), 'HH:mm', { locale: fr })}
                        {intervention.endDate && (
                          <> - {format(new Date(intervention.endDate), 'HH:mm', { locale: fr })}</>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-6 hidden lg:table-cell">
                      {getPriorityBadge(intervention.priority)}
                    </td>
                    <td className="py-3 px-6 text-sm hidden lg:table-cell">
                      {intervention.technicians.join(', ')}
                    </td>
                    <td className="py-3 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Wrench className="h-4 w-4" />
                        </Button>
                        {intervention.status === 'scheduled' && (
                          <Button variant="ghost" size="icon">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        <InterventionFormDialog 
                          intervention={intervention}
                          onInterventionSaved={loadInterventions}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {sortedInterventions.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">Aucune intervention trouvée</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InterventionsPage;
