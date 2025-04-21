
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { MaintenanceCalendar } from "@/components/dashboard/MaintenanceCalendar";
import { RecentInterventions } from "@/components/dashboard/RecentInterventions";
import { StatOverviewGrid } from "@/components/dashboard/StatOverviewGrid";

type DashboardTabsProps = {
  stats: any;
  maintenanceEvents: any[];
};

export function DashboardTabs({ stats, maintenanceEvents }: DashboardTabsProps) {
  return (
    <Tabs defaultValue="today" className="space-y-8">
      <TabsList className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <TabsTrigger value="today">Aujourd&apos;hui</TabsTrigger>
        <TabsTrigger value="week">Cette semaine</TabsTrigger>
        <TabsTrigger value="month">Ce mois</TabsTrigger>
      </TabsList>
      <TabsContent value="today" className="space-y-8">
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <Card className="col-span-1 lg:col-span-2 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold">Calendrier des interventions</CardTitle>
            </CardHeader>
            <CardContent>
              <MaintenanceCalendar events={maintenanceEvents} />
            </CardContent>
          </Card>
          <RecentInterventions maintenanceEvents={maintenanceEvents} />
        </div>
      </TabsContent>
      <TabsContent value="week" className="space-y-8">
        <StatOverviewGrid stats={stats} type="week" />
      </TabsContent>
      <TabsContent value="month" className="space-y-8">
        <StatOverviewGrid stats={stats} type="month" />
      </TabsContent>
    </Tabs>
  );
}
