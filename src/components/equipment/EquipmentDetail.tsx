import { useState, useRef } from 'react';
import { 
  AlertCircle, Calendar, Clock, FileText, Info, 
  Settings, Timer, Wrench, BarChart, Sparkles, Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { equipmentData } from '@/data/equipmentData';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { useLocation } from 'react-router-dom';

// Types
type MaintenanceRecord = {
  id: string;
  date: Date;
  type: 'preventive' | 'corrective';
  title: string;
  description: string;
  technician: string;
  duration: number; // minutes
  status: 'completed' | 'in-progress' | 'scheduled';
};

type SparePartUsage = {
  id: string;
  partId: string;
  partName: string;
  quantity: number;
  date: Date;
  maintenanceId: string;
};

type EquipmentDetailProps = {
  id: string;
};

export const EquipmentDetail = ({ id }: EquipmentDetailProps) => {
  const [activeTab, setActiveTab] = useState("info");
  const contentRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const isOnFichesPage = location.pathname === '/equipements/fiches';
  
  // Find equipment by id from equipmentData
  const equipmentItem = equipmentData.find(item => item.id === id);
  
  if (!equipmentItem) {
    return <div className="p-4">Équipement non trouvé</div>;
  }
  
  // Function to generate and download PDF report
  const generatePDF = async () => {
    if (!contentRef.current) return;
    
    // Create loading state or notification here if desired
    
    try {
      const content = contentRef.current;
      const canvas = await html2canvas(content, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`fiche-technique-${equipmentItem.name}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Show error notification if desired
    }
  };
  
  // Mock maintenance history
  const maintenanceHistory: MaintenanceRecord[] = [
    {
      id: 'maint1',
      date: new Date('2024-01-10'),
      type: 'preventive',
      title: 'Maintenance préventive trimestrielle',
      description: 'Changement des joints et vérification des roulements',
      technician: 'Jean Dupont',
      duration: 120,
      status: 'completed',
    },
    {
      id: 'maint2',
      date: new Date('2023-10-05'),
      type: 'preventive',
      title: 'Maintenance préventive trimestrielle',
      description: 'Inspection visuelle et vérification des paramètres',
      technician: 'Sarah Martin',
      duration: 90,
      status: 'completed',
    },
    {
      id: 'maint3',
      date: new Date('2023-07-12'),
      type: 'corrective',
      title: 'Fuite au niveau du joint',
      description: 'Remplacement du joint défectueux',
      technician: 'Pierre Lefebvre',
      duration: 180,
      status: 'completed',
    },
    {
      id: 'maint4',
      date: new Date('2024-04-10'),
      type: 'preventive',
      title: 'Maintenance préventive trimestrielle',
      description: 'Vérification complète et graissage',
      technician: 'Marie Dubois',
      duration: 120,
      status: 'scheduled',
    },
  ];
  
  // Mock spare parts usage
  const sparePartsUsage: SparePartUsage[] = [
    {
      id: 'usage1',
      partId: 'sp1',
      partName: 'Joint d\'étanchéité',
      quantity: 2,
      date: new Date('2024-01-10'),
      maintenanceId: 'maint1',
    },
    {
      id: 'usage2',
      partId: 'sp2',
      partName: 'Roulement à billes',
      quantity: 1,
      date: new Date('2024-01-10'),
      maintenanceId: 'maint1',
    },
    {
      id: 'usage3',
      partId: 'sp1',
      partName: 'Joint d\'étanchéité',
      quantity: 1,
      date: new Date('2023-07-12'),
      maintenanceId: 'maint3',
    },
    {
      id: 'usage4',
      partId: 'sp3',
      partName: 'Garniture mécanique',
      quantity: 1,
      date: new Date('2023-07-12'),
      maintenanceId: 'maint3',
    },
  ];
  
  // Mock documents
  const documents = [
    { id: 'doc1', name: 'Manuel d\'utilisation', type: 'pdf' },
    { id: 'doc2', name: 'Schéma électrique', type: 'pdf' },
    { id: 'doc3', name: 'Guide de maintenance', type: 'pdf' },
    { id: 'doc4', name: 'Certificat de conformité', type: 'pdf' },
  ];
  
  // Mock spare parts
  const spareParts = [
    { id: 'sp1', name: 'Joint d\'étanchéité', reference: 'JE-101', quantity: 5, threshold: 2 },
    { id: 'sp2', name: 'Roulement à billes', reference: 'RB-202', quantity: 3, threshold: 2 },
    { id: 'sp3', name: 'Garniture mécanique', reference: 'GM-303', quantity: 1, threshold: 1 },
    { id: 'sp4', name: 'Roue', reference: 'R-404', quantity: 1, threshold: 1 },
  ];
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'operational':
        return <Badge className="bg-success">Opérationnel</Badge>;
      case 'maintenance':
        return <Badge className="bg-warning">En maintenance</Badge>;
      case 'breakdown':
        return <Badge className="bg-destructive">En panne</Badge>;
      case 'standby':
        return <Badge className="bg-secondary">En veille</Badge>;
      default:
        return <Badge>Inconnu</Badge>;
    }
  };
  
  const getMaintenanceStatusBadge = (status: 'completed' | 'in-progress' | 'scheduled') => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-success">Terminé</Badge>;
      case 'in-progress':
        return <Badge className="bg-warning">En cours</Badge>;
      case 'scheduled':
        return <Badge className="bg-primary">Planifié</Badge>;
      default:
        return <Badge>Inconnu</Badge>;
    }
  };

  // Convert string dates to Date objects for display formatting
  const installationDate = parseISO(equipmentItem.installationDate);
  const lastMaintenanceDate = parseISO(equipmentItem.lastMaintenance);
  const nextMaintenanceDate = parseISO(equipmentItem.nextMaintenance);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{equipmentItem.name}</h1>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-sm text-muted-foreground">
              {equipmentItem.manufacturer} {equipmentItem.model}
            </p>
            <p className="text-sm text-muted-foreground">
              SN: {equipmentItem.serialNumber}
            </p>
            {getStatusBadge(equipmentItem.status)}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={generatePDF}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            <Download className="mr-2 h-4 w-4" />
            Télécharger PDF
          </button>
          {!isOnFichesPage && (
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
              <Wrench className="mr-2 h-4 w-4" />
              Nouvelle intervention
            </button>
          )}
        </div>
      </div>
      
      <div ref={contentRef}>
        <Tabs defaultValue="info" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="info">
              <Info className="mr-2 h-4 w-4" />
              Informations
            </TabsTrigger>
            <TabsTrigger value="maintenance">
              <Wrench className="mr-2 h-4 w-4" />
              Maintenance
            </TabsTrigger>
            <TabsTrigger value="parts">
              <Settings className="mr-2 h-4 w-4" />
              Pièces détachées
            </TabsTrigger>
            <TabsTrigger value="metrics">
              <BarChart className="mr-2 h-4 w-4" />
              Métriques
            </TabsTrigger>
            <TabsTrigger value="documents">
              <FileText className="mr-2 h-4 w-4" />
              Documents
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Détails techniques</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 text-sm">
                    <span className="text-muted-foreground">Fabricant</span>
                    <span className="font-medium">{equipmentItem.manufacturer}</span>
                  </div>
                  <div className="grid grid-cols-2 text-sm">
                    <span className="text-muted-foreground">Modèle</span>
                    <span className="font-medium">{equipmentItem.model}</span>
                  </div>
                  <div className="grid grid-cols-2 text-sm">
                    <span className="text-muted-foreground">Numéro de série</span>
                    <span className="font-medium">{equipmentItem.serialNumber}</span>
                  </div>
                  <div className="grid grid-cols-2 text-sm">
                    <span className="text-muted-foreground">Emplacement</span>
                    <span className="font-medium">{equipmentItem.location}</span>
                  </div>
                  <div className="grid grid-cols-2 text-sm">
                    <span className="text-muted-foreground">Date d'installation</span>
                    <span className="font-medium">
                      {format(installationDate, 'dd/MM/yyyy')}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 text-sm">
                    <span className="text-muted-foreground">Criticité</span>
                    <span className="font-medium capitalize">
                      {equipmentItem.criticalityLevel === 'high' && 
                        <span className="text-destructive flex items-center">
                          <AlertCircle className="mr-1 h-3 w-3" />
                          Élevée
                        </span>
                      }
                      {equipmentItem.criticalityLevel === 'medium' && 
                        <span className="text-warning flex items-center">
                          Moyenne
                        </span>
                      }
                      {equipmentItem.criticalityLevel === 'low' && 
                        <span className="text-success flex items-center">
                          Faible
                        </span>
                      }
                    </span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Spécifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(equipmentItem.specifications).map(([key, value]) => (
                      <div key={key} className="grid grid-cols-2 text-sm">
                        <span className="text-muted-foreground capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Maintenance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 text-sm">
                    <span className="text-muted-foreground">Dernière maintenance</span>
                    <span className="font-medium">
                      {format(lastMaintenanceDate, 'dd/MM/yyyy')}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 text-sm">
                    <span className="text-muted-foreground">Prochaine maintenance</span>
                    <span className="font-medium">
                      {format(nextMaintenanceDate, 'dd/MM/yyyy')}
                      <span className="ml-1 text-xs text-muted-foreground">
                        ({formatDistanceToNow(nextMaintenanceDate, { addSuffix: true, locale: fr })})
                      </span>
                    </span>
                  </div>
                  <div className="grid grid-cols-2 text-sm">
                    <span className="text-muted-foreground">MTBF</span>
                    <span className="font-medium">{equipmentItem.mtbf} heures</span>
                  </div>
                  <div className="grid grid-cols-2 text-sm">
                    <span className="text-muted-foreground">MTTR</span>
                    <span className="font-medium">{equipmentItem.mttr} heures</span>
                  </div>
                  <div className="grid grid-cols-2 text-sm">
                    <span className="text-muted-foreground">Disponibilité</span>
                    <span className="font-medium">{equipmentItem.uptime}%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="maintenance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Historique des interventions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {maintenanceHistory.map((record) => (
                    <div 
                      key={record.id} 
                      className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b pb-4 last:border-b-0 last:pb-0"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 h-8 w-8 rounded-full flex items-center justify-center ${
                          record.type === 'preventive' ? 'bg-primary/10 text-primary' : 'bg-warning/10 text-warning'
                        }`}>
                          {record.type === 'preventive' ? <Sparkles size={16} /> : <Wrench size={16} />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{record.title}</h4>
                            {getMaintenanceStatusBadge(record.status)}
                            <Badge className={record.type === 'preventive' ? 'bg-primary/10 text-primary' : 'bg-warning/10 text-warning'}>
                              {record.type === 'preventive' ? 'Préventif' : 'Correctif'}
                            </Badge>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">{record.description}</p>
                          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                            <span className="flex items-center">
                              <Calendar className="mr-1 h-3 w-3" />
                              {format(record.date, 'dd/MM/yyyy')}
                            </span>
                            <span className="flex items-center">
                              <Timer className="mr-1 h-3 w-3" />
                              {record.duration} minutes
                            </span>
                            <span className="flex items-center">
                              <Clock className="mr-1 h-3 w-3" />
                              {record.technician}
                            </span>
                          </div>
                        </div>
                      </div>
                      {record.status !== 'scheduled' && (
                        <div className="flex-shrink-0 mt-2 sm:mt-0">
                          <button className="text-xs text-primary hover:underline">
                            Voir le rapport
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="parts" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Pièces détachées associées</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {spareParts.map((part) => (
                      <div key={part.id} className="flex items-start justify-between gap-3 border-b pb-4 last:border-b-0 last:pb-0">
                        <div>
                          <h4 className="font-medium">{part.name}</h4>
                          <p className="text-xs text-muted-foreground">Réf: {part.reference}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{part.quantity} en stock</div>
                          {part.quantity <= part.threshold && (
                            <span className="text-xs text-destructive flex items-center">
                              <AlertCircle className="mr-1 h-3 w-3" />
                              Sous le seuil min. ({part.threshold})
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Historique d'utilisation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sparePartsUsage.map((usage) => (
                      <div key={usage.id} className="flex items-start justify-between gap-3 border-b pb-4 last:border-b-0 last:pb-0">
                        <div>
                          <h4 className="font-medium">{usage.partName}</h4>
                          <p className="text-xs text-muted-foreground">
                            {format(usage.date, 'dd/MM/yyyy')} • Intervention #{usage.maintenanceId.slice(-1)}
                          </p>
                        </div>
                        <div className="font-medium">{usage.quantity} utilisé{usage.quantity > 1 ? 's' : ''}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="metrics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Indicateurs de performance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Visualisation des métriques de fiabilité et de performance sur les 12 derniers mois
                </p>
                <div className="h-[300px] flex items-center justify-center bg-muted/30 rounded-md">
                  <p className="text-muted-foreground">Graphiques de performances (MTBF, MTTR, Disponibilité)</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Documents techniques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2">
                  {documents.map((doc) => (
                    <div 
                      key={doc.id} 
                      className="flex items-center gap-3 p-3 border rounded-md hover:bg-muted/20 cursor-pointer"
                    >
                      <FileText className="h-8 w-8 text-primary" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-xs text-muted-foreground uppercase">{doc.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
