
import { Settings, Wrench } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MaintenanceEvent } from '@/types/maintenance';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

type RecentInterventionsProps = {
  events: MaintenanceEvent[];
};

export const RecentInterventions = ({ events }: RecentInterventionsProps) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Wrench size={18} />
          Dernières interventions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {events.slice(0, 3).map((event) => (
            <div key={event.id} className="flex items-start space-x-3 pb-3 border-b last:border-b-0 last:pb-0">
              <div className={`h-9 w-9 rounded-full flex items-center justify-center ${
                event.status === 'completed' ? 'bg-success/10 text-success' : 
                event.status === 'in-progress' ? 'bg-primary/10 text-primary' :
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
                    {formatDistanceToNow(new Date(event.date), { addSuffix: true, locale: fr })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
