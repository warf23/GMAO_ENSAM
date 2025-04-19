import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  AlertCircle, ArrowUpDown, CheckCircle, ChevronsUpDown, 
  Filter, Plus, Search, Settings, Wrench
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Type for equipment list
type Equipment = {
  id: string;
  name: string;
  location: string;
  status: 'operational' | 'maintenance' | 'breakdown' | 'standby';
  type: string;
  serialNumber: string;
  nextMaintenance: Date | null;
  criticalityLevel: 'low' | 'medium' | 'high';
};
import { EquipmentFormDialog } from '@/components/equipment/EquipmentFormDialog';

const EquipmentListPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data
  const equipments: Equipment[] = [
    {
      id: 'eq001',
      name: 'Pompe centrifuge P-101',
      location: 'Unité A / Zone 1',
      status: 'operational',
      type: 'Pompe',
      serialNumber: 'SN-PC101-2023',
      nextMaintenance: new Date('2024-04-15'),
      criticalityLevel: 'high',
    },
    {
      id: 'eq002',
      name: 'Compresseur C-201',
      location: 'Unité B / Zone 2',
      status: 'maintenance',
      type: 'Compresseur',
      serialNumber: 'SN-CC201-2022',
      nextMaintenance: new Date('2024-04-10'),
      criticalityLevel: 'high',
    },
    {
      id: 'eq003',
      name: 'Moteur électrique M-301',
      location: 'Unité A / Zone 3',
      status: 'operational',
      type: 'Moteur',
      serialNumber: 'SN-ME301-2023',
      nextMaintenance: new Date('2024-05-20'),
      criticalityLevel: 'medium',
    },
    {
      id: 'eq004',
      name: 'Échangeur de chaleur E-401',
      location: 'Unité C / Zone 1',
      status: 'breakdown',
      type: 'Échangeur',
      serialNumber: 'SN-EC401-2021',
      nextMaintenance: null,
      criticalityLevel: 'high',
    },
    {
      id: 'eq005',
      name: 'Vanne V-501',
      location: 'Unité B / Zone 3',
      status: 'operational',
      type: 'Vanne',
      serialNumber: 'SN-VA501-2023',
      nextMaintenance: new Date('2024-06-05'),
      criticalityLevel: 'low',
    },
    {
      id: 'eq006',
      name: 'Filtre F-601',
      location: 'Unité C / Zone 2',
      status: 'standby',
      type: 'Filtre',
      serialNumber: 'SN-FI601-2022',
      nextMaintenance: new Date('2024-05-15'),
      criticalityLevel: 'medium',
    },
  ];
  
  const filteredEquipments = equipments.filter((equipment) => 
    equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equipment.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equipment.type.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getStatusBadge = (status: Equipment['status']) => {
    switch (status) {
      case 'operational':
        return (
          <Badge className="bg-success">
            <CheckCircle className="mr-1 h-3 w-3" />
            Opérationnel
          </Badge>
        );
      case 'maintenance':
        return (
          <Badge className="bg-warning">
            <Wrench className="mr-1 h-3 w-3" />
            En maintenance
          </Badge>
        );
      case 'breakdown':
        return (
          <Badge className="bg-destructive">
            <AlertCircle className="mr-1 h-3 w-3" />
            En panne
          </Badge>
        );
      case 'standby':
        return (
          <Badge className="bg-secondary">
            En veille
          </Badge>
        );
      default:
        return <Badge>Inconnu</Badge>;
    }
  };
  
  const getCriticalityBadge = (level: Equipment['criticalityLevel']) => {
    switch (level) {
      case 'high':
        return (
          <span className="text-destructive text-xs flex items-center">
            <AlertCircle className="mr-1 h-3 w-3" />
            Élevée
          </span>
        );
      case 'medium':
        return <span className="text-warning text-xs">Moyenne</span>;
      case 'low':
        return <span className="text-success text-xs">Faible</span>;
      default:
        return <span className="text-xs">Inconnue</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Équipements</h1>
          <p className="text-muted-foreground">Gérez et surveillez vos équipements</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filtres
          </Button>
          <EquipmentFormDialog />
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher par nom, emplacement ou type..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>
      
      <Card>
        <CardHeader className="px-6 py-4">
          <CardTitle className="text-base font-medium">Liste des équipements ({filteredEquipments.length})</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <div className="border-t">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="py-3 px-6 text-left text-sm font-medium text-muted-foreground">
                    <div className="flex items-center gap-1">
                      Nom
                      <ChevronsUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="py-3 px-6 text-left text-sm font-medium text-muted-foreground hidden md:table-cell">Type</th>
                  <th className="py-3 px-6 text-left text-sm font-medium text-muted-foreground hidden lg:table-cell">Emplacement</th>
                  <th className="py-3 px-6 text-left text-sm font-medium text-muted-foreground">Statut</th>
                  <th className="py-3 px-6 text-left text-sm font-medium text-muted-foreground hidden lg:table-cell">Criticité</th>
                  <th className="py-3 px-6 text-left text-sm font-medium text-muted-foreground hidden md:table-cell">SN</th>
                  <th className="py-3 px-6 text-right text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEquipments.map((equipment) => (
                  <tr key={equipment.id} className="border-b hover:bg-muted/30">
                    <td className="py-3 px-6">
                      <Link to={`/equipements/${equipment.id}`} className="font-medium text-primary hover:underline">
                        {equipment.name}
                      </Link>
                    </td>
                    <td className="py-3 px-6 hidden md:table-cell">{equipment.type}</td>
                    <td className="py-3 px-6 hidden lg:table-cell text-sm">{equipment.location}</td>
                    <td className="py-3 px-6">{getStatusBadge(equipment.status)}</td>
                    <td className="py-3 px-6 hidden lg:table-cell">{getCriticalityBadge(equipment.criticalityLevel)}</td>
                    <td className="py-3 px-6 text-sm text-muted-foreground hidden md:table-cell">{equipment.serialNumber}</td>
                    <td className="py-3 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Wrench className="h-4 w-4" />
                        </Button>
                        <EquipmentFormDialog equipment={equipment} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredEquipments.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">Aucun équipement trouvé</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EquipmentListPage;
