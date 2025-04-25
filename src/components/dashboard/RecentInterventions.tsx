
import { Settings, Wrench, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MaintenanceEvent } from '@/types/maintenance';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

type RecentInterventionsProps = {
  events: MaintenanceEvent[];
};

export const RecentInterventions = ({ events }: RecentInterventionsProps) => {
  const sortedEvents = events
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={14} />;
      case 'in-progress':
        return <Clock size={14} />;
      case 'overdue':
        return <AlertCircle size={14} />;
      default:
        return <Clock size={14} />;
    }
  };

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
          {sortedEvents.map((event) => (
            <div 
              key={event.id} 
              className="flex items-start space-x-3 pb-3 border-b last:border-b-0 last:pb-0 hover:bg-muted/50 rounded-lg p-2 transition-colors"
            >
              <div className={`h-9 w-9 rounded-full flex items-center justify-center ${
                event.status === 'completed' ? 'bg-success/10 text-success' : 
                event.status === 'in-progress' ? 'bg-primary/10 text-primary' :
                event.status === 'overdue' ? 'bg-destructive/10 text-destructive' : 
                'bg-primary/10 text-primary'
              }`}>
                {event.type === 'preventive' ? <Settings size={16} /> : <Wrench size={16} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{event.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{event.equipmentName}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                        event.status === 'completed' ? 'bg-success/10 text-success' :
                        event.status === 'in-progress' ? 'bg-primary/10 text-primary' :
                        event.status === 'overdue' ? 'bg-destructive/10 text-destructive' :
                        'bg-primary/10 text-primary'
                      }`}>
                        {getStatusIcon(event.status)}
                        {event.status === 'completed' ? 'Terminé' :
                         event.status === 'in-progress' ? 'En cours' :
                         event.status === 'overdue' ? 'En retard' : 
                         'Planifié'}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
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
