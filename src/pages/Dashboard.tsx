
import { useState } from 'react';
import { Activity, Calendar, Clock, Package, Settings, Wrench } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { ParetoChart } from '@/components/dashboard/ParetoChart';
import { MaintenanceCalendar } from '@/components/dashboard/MaintenanceCalendar';
import { PerformanceIndicator } from '@/components/dashboard/PerformanceIndicator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { addDays, formatDistanceToNow, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';

// Types
type MaintenanceEvent = {
  id: string;
  title: string;
  date: Date;
  equipmentId: string;
  equipmentName: string;
  status: 'planned' | 'completed' | 'overdue';
  type: 'preventive' | 'corrective';
};

// Mock data
const paretoData = [
  { name: 'Panne électrique', value: 35 },
  { name: 'Usure mécanique', value: 25 },
  { name: 'Défaut lubrification', value: 18 },
  { name: 'Erreur opérateur', value: 12 },
  { name: 'Problème hydraulique', value: 8 },
  { name: 'Autres', value: 5 },
];

const maintenanceEvents: MaintenanceEvent[] = [
  {
    id: '1',
    title: 'Maintenance préventive',
    date: addDays(new Date(), 2),
    equipmentId: 'EQ001',
    equipmentName: 'Pompe P-101',
    status: 'planned',
    type: 'preventive',
  },
  {
    id: '2',
    title: 'Remplacement roulement',
    date: new Date(),
    equipmentId: 'EQ002',
    equipmentName: 'Compresseur C-201',
    status: 'planned',
    type: 'preventive',
  },
  {
    id: '3',
    title: 'Réparation fuite',
    date: subDays(new Date(), 1),
    equipmentId: 'EQ003',
    equipmentName: 'Cuve T-301',
    status: 'completed',
    type: 'corrective',
  },
  {
    id: '4',
    title: 'Inspection programmée',
    date: subDays(new Date(), 3),
    equipmentId: 'EQ004',
    equipmentName: 'Échangeur E-401',
    status: 'overdue',
    type: 'preventive',
  },
];

const Dashboard = () => {
  const [tabValue, setTabValue] = useState("today");
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Tableau de bord</h1>
      
      <Tabs defaultValue="today" onValueChange={setTabValue}>
        <TabsList>
          <TabsTrigger value="today">Aujourd'hui</TabsTrigger>
          <TabsTrigger value="week">Cette semaine</TabsTrigger>
          <TabsTrigger value="month">Ce mois</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-6">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Interventions en cours"
              value="5"
              description="2 préventives, 3 correctives"
              icon={Activity}
              trend="up"
              trendValue="+2 aujourd'hui"
              iconClassName="bg-primary/10 text-primary"
            />
            <StatCard
              title="En attente"
              value="3"
              description="Interventions planifiées"
              icon={Clock}
              trend="neutral"
              trendValue="inchangé"
              iconClassName="bg-warning/10 text-warning"
            />
            <StatCard
              title="Equipements en panne"
              value="2"
              description="Sur 42 équipements"
              icon={Settings}
              trend="down"
              trendValue="-1 depuis hier"
              iconClassName="bg-destructive/10 text-destructive"
            />
            <StatCard
              title="Stock critique"
              value="4"
              description="Pièces sous le seuil"
              icon={Package}
              trend="up"
              trendValue="+1 aujourd'hui"
              iconClassName="bg-warning/10 text-warning"
            />
          </div>
        </TabsContent>
        
        {/* Les autres onglets utiliseraient des données différentes */}
        <TabsContent value="week" className="space-y-6">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Interventions totales"
              value="18"
              description="8 préventives, 10 correctives"
              icon={Activity}
              trend="up"
              trendValue="+5 cette semaine"
              iconClassName="bg-primary/10 text-primary"
            />
            <StatCard
              title="En attente"
              value="7"
              description="Interventions planifiées"
              icon={Clock}
              trend="up"
              trendValue="+2 cette semaine"
              iconClassName="bg-warning/10 text-warning"
            />
            <StatCard
              title="Equipements en panne"
              value="2"
              description="Sur 42 équipements"
              icon={Settings}
              trend="down"
              trendValue="-3 cette semaine"
              iconClassName="bg-destructive/10 text-destructive"
            />
            <StatCard
              title="Stock critique"
              value="4"
              description="Pièces sous le seuil"
              icon={Package}
              trend="neutral"
              trendValue="inchangé"
              iconClassName="bg-warning/10 text-warning"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="month" className="space-y-6">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Interventions totales"
              value="42"
              description="25 préventives, 17 correctives"
              icon={Activity}
              trend="down"
              trendValue="-8 vs mois dernier"
              iconClassName="bg-primary/10 text-primary"
            />
            <StatCard
              title="En attente"
              value="9"
              description="Interventions planifiées"
              icon={Clock}
              trend="up"
              trendValue="+3 ce mois"
              iconClassName="bg-warning/10 text-warning"
            />
            <StatCard
              title="Equipements en panne"
              value="2"
              description="Sur 42 équipements"
              icon={Settings}
              trend="down"
              trendValue="-5 ce mois"
              iconClassName="bg-destructive/10 text-destructive"
            />
            <StatCard
              title="Stock critique"
              value="4"
              description="Pièces sous le seuil"
              icon={Package}
              trend="down"
              trendValue="-2 ce mois"
              iconClassName="bg-warning/10 text-warning"
            />
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <MaintenanceCalendar events={maintenanceEvents} />
        
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Wrench size={18} />
                Dernières interventions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {maintenanceEvents.slice(0, 3).map((event) => (
                  <div key={event.id} className="flex items-start space-x-3 pb-3 border-b last:border-b-0 last:pb-0">
                    <div className={`h-9 w-9 rounded-full flex items-center justify-center ${
                      event.status === 'completed' ? 'bg-success/10 text-success' : 
                      event.status === 'overdue' ? 'bg-destructive/10 text-destructive' : 
                      'bg-primary/10 text-primary'
                    }`}>
                      {event.type === 'preventive' ? <Settings size={16} /> : <Wrench size={16} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-sm">{event.title}</p>
                          <p className="text-xs text-muted-foreground">{event.equipmentName}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(event.date, { addSuffix: true, locale: fr })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ParetoChart data={paretoData} title="Analyse Pareto des causes de pannes" height={300} />
        </div>
        <div className="space-y-6">
          <PerformanceIndicator 
            title="TRS (Taux de rendement synthétique)" 
            value={78.5} 
            target={85}
            unit="%"
            description="Disponibilité × Performance × Qualité"
            status="warning"
          />
          <PerformanceIndicator 
            title="MTBF (Temps moyen entre pannes)" 
            value={124} 
            target={150}
            unit="heures"
            description="Fiabilité des équipements"
            status="warning"
          />
          <PerformanceIndicator 
            title="MTTR (Temps moyen de réparation)" 
            value={2.3} 
            target={3}
            unit="heures"
            description="Durée moyenne des interventions"
            status="success"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
