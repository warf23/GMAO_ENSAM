
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  AlertCircle, ArrowLeft, Calendar, CheckCircle, Clock, 
  FileText, Timer, User, Wrench, Sparkles, Settings
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';

// Type for equipment list (simple version)
type Equipment = {
  id: string;
  name: string;
  location: string;
  type: string;
};

// Types for interventions
type InterventionStatus = 'completed' | 'in-progress' | 'scheduled' | 'canceled';
type InterventionType = 'corrective' | 'preventive';

type Intervention = {
  id: string;
  title: string;
  description: string;
  equipmentId: string;
  equipmentName: string;
  type: InterventionType;
  status: InterventionStatus;
  priority: 'low' | 'medium' | 'high' | 'critical';
  startDate: string;
  endDate: string | null;
  duration: number | null; // in minutes
  technicians: string[];
  causesOfFailure?: string[];
  spareParts?: {
    id: string;
    name: string;
    quantity: number;
  }[];
  notes?: string[];
};

const InterventionDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("details");
  
  // Mock intervention data (would come from API)
  const interventions: Intervention[] = [
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
      notes: ['Prévoir remplacement des filtres', 'Vérifier les niveaux d\'huile'],
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
      notes: ['Pièces remplacées avec succès', 'Recommandation: vérifier alignement'],
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
      notes: ['Intervention en cours', 'Pièces de rechange commandées'],
    },
  ];
  
  const intervention = interventions.find(item => item.id === id);
  
  if (!intervention) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">Intervention non trouvée</p>
        <Button variant="link" asChild className="mt-4">
          <Link to="/maintenance/interventions">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à la liste
          </Link>
        </Button>
      </div>
    );
  }
  
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
  
  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'critical':
        return (
          <span className="text-destructive font-medium flex items-center">
            <AlertCircle className="mr-1 h-4 w-4" />
            Critique
          </span>
        );
      case 'high':
        return <span className="text-warning font-medium">Haute</span>;
      case 'medium':
        return <span className="text-primary font-medium">Moyenne</span>;
      case 'low':
        return <span className="text-success font-medium">Basse</span>;
      default:
        return <span>Inconnue</span>;
    }
  };
  
  const handleComplete = () => {
    toast.success("Intervention terminée", {
      description: "Le statut de l'intervention a été mis à jour.",
    });
  };
  
  const handleCancel = () => {
    toast.success("Intervention annulée", {
      description: "L'intervention a été annulée avec succès.",
    });
  };
  
  const handleEdit = () => {
    toast.info("Fonctionnalité à venir", {
      description: "L'édition d'interventions sera disponible prochainement.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Link to="/maintenance/interventions" className="hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <span>/</span>
        <Link to="/maintenance/interventions" className="hover:text-foreground">
          Interventions
        </Link>
        <span>/</span>
        <span className="text-foreground">{intervention.title}</span>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">{intervention.title}</h1>
            {getStatusBadge(intervention.status)}
            {getTypeBadge(intervention.type)}
          </div>
          <p className="text-muted-foreground mt-1">{intervention.description}</p>
        </div>
        <div className="flex items-center gap-2">
          {intervention.status === 'scheduled' && (
            <>
              <Button variant="outline" onClick={handleCancel}>
                Annuler
              </Button>
              <Button onClick={handleComplete}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Marquer terminée
              </Button>
            </>
          )}
          {intervention.status === 'in-progress' && (
            <Button onClick={handleComplete}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Terminer
            </Button>
          )}
          {intervention.status === 'completed' && (
            <Button onClick={handleEdit}>
              <FileText className="mr-2 h-4 w-4" />
              Rapport
            </Button>
          )}
          <Button variant="outline" onClick={handleEdit}>
            <Settings className="mr-2 h-4 w-4" />
            Modifier
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="details">
            <FileText className="mr-2 h-4 w-4" />
            Détails
          </TabsTrigger>
          <TabsTrigger value="spare-parts">
            <Settings className="mr-2 h-4 w-4" />
            Pièces utilisées
          </TabsTrigger>
          <TabsTrigger value="notes">
            <FileText className="mr-2 h-4 w-4" />
            Notes
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-4 mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Informations générales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 text-sm">
                  <span className="text-muted-foreground">Équipement</span>
                  <Link 
                    to={`/equipements/${intervention.equipmentId}`} 
                    className="font-medium text-primary hover:underline"
                  >
                    {intervention.equipmentName}
                  </Link>
                </div>
                <div className="grid grid-cols-2 text-sm">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-medium">
                    {intervention.type === 'preventive' ? 'Préventive' : 'Corrective'}
                  </span>
                </div>
                <div className="grid grid-cols-2 text-sm">
                  <span className="text-muted-foreground">Statut</span>
                  <span className="font-medium">
                    {intervention.status === 'completed' ? 'Terminée' : 
                     intervention.status === 'in-progress' ? 'En cours' : 
                     intervention.status === 'scheduled' ? 'Planifiée' : 'Annulée'}
                  </span>
                </div>
                <div className="grid grid-cols-2 text-sm">
                  <span className="text-muted-foreground">Priorité</span>
                  <span className="font-medium">
                    {getPriorityLabel(intervention.priority)}
                  </span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Planification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 text-sm">
                  <span className="text-muted-foreground">Date de début</span>
                  <span className="font-medium">
                    {format(new Date(intervention.startDate), 'dd MMMM yyyy', { locale: fr })}
                  </span>
                </div>
                <div className="grid grid-cols-2 text-sm">
                  <span className="text-muted-foreground">Heure de début</span>
                  <span className="font-medium">
                    {format(new Date(intervention.startDate), 'HH:mm', { locale: fr })}
                  </span>
                </div>
                {intervention.endDate && (
                  <>
                    <div className="grid grid-cols-2 text-sm">
                      <span className="text-muted-foreground">Date de fin</span>
                      <span className="font-medium">
                        {format(new Date(intervention.endDate), 'dd MMMM yyyy', { locale: fr })}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 text-sm">
                      <span className="text-muted-foreground">Heure de fin</span>
                      <span className="font-medium">
                        {format(new Date(intervention.endDate), 'HH:mm', { locale: fr })}
                      </span>
                    </div>
                  </>
                )}
                <div className="grid grid-cols-2 text-sm">
                  <span className="text-muted-foreground">Durée prévue</span>
                  <span className="font-medium">
                    {intervention.duration ? `${intervention.duration} minutes` : 'Non définie'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Techniciens assignés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {intervention.technicians.map((tech, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50">
                    <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      <User size={16} />
                    </div>
                    <div>
                      <p className="font-medium">{tech}</p>
                      <p className="text-xs text-muted-foreground">Technicien</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {intervention.type === 'corrective' && intervention.causesOfFailure && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Causes de panne</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-1">
                  {intervention.causesOfFailure.map((cause, index) => (
                    <li key={index} className="text-sm">{cause}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="spare-parts" className="space-y-4 mt-6">
          {intervention.spareParts && intervention.spareParts.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Pièces détachées utilisées</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50 border-b">
                        <th className="py-2 px-4 text-left text-sm font-medium text-muted-foreground">Référence</th>
                        <th className="py-2 px-4 text-left text-sm font-medium text-muted-foreground">Désignation</th>
                        <th className="py-2 px-4 text-right text-sm font-medium text-muted-foreground">Quantité</th>
                      </tr>
                    </thead>
                    <tbody>
                      {intervention.spareParts.map((part) => (
                        <tr key={part.id} className="border-b last:border-b-0 hover:bg-muted/30">
                          <td className="py-2 px-4 text-sm">{part.id}</td>
                          <td className="py-2 px-4 text-sm">{part.name}</td>
                          <td className="py-2 px-4 text-sm text-right">{part.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">Aucune pièce détachée utilisée</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="notes" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Notes et observations</CardTitle>
            </CardHeader>
            <CardContent>
              {intervention.notes && intervention.notes.length > 0 ? (
                <ul className="space-y-3">
                  {intervention.notes.map((note, index) => (
                    <li key={index} className="p-3 bg-muted/20 rounded-md text-sm">
                      {note}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-muted-foreground py-4">Aucune note disponible</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InterventionDetailPage;
