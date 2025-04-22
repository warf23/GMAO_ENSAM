
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { format, isSameDay, startOfToday } from 'date-fns';
import { fr } from 'date-fns/locale';
import { MaintenanceEvent } from '@/types/maintenance';

type MaintenanceCalendarProps = {
  events: MaintenanceEvent[];
};

export const MaintenanceCalendar = ({ events }: MaintenanceCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(startOfToday());
  
  const getDateClassName = (date: Date) => {
    const eventForDate = events.find(event => isSameDay(date, new Date(event.date)));
    
    if (!eventForDate) return '';
    
    if (eventForDate.status === 'overdue') return 'bg-destructive/10 text-destructive hover:bg-destructive/20';
    if (eventForDate.status === 'completed') return 'bg-success/10 text-success hover:bg-success/20';
    return 'bg-primary/10 text-primary hover:bg-primary/20';
  };
  
  const getEventsForSelectedDate = () => {
    if (!selectedDate) return [];
    return events.filter(event => isSameDay(new Date(event.date), selectedDate));
  };
  
  const selectedEvents = getEventsForSelectedDate();

  const getStatusBadge = (status: string) => {
    if (status === 'completed') {
      return (
        <Badge className="bg-success">
          <CheckCircle size={14} className="mr-1" />
          Terminé
        </Badge>
      );
    }
    if (status === 'planned' || status === 'in-progress') {
      return (
        <Badge className="bg-primary">
          <Clock size={14} className="mr-1" />
          {status === 'in-progress' ? 'En cours' : 'Planifié'}
        </Badge>
      );
    }
    return (
      <Badge className="bg-destructive">
        <AlertCircle size={14} className="mr-1" />
        En retard
      </Badge>
    );
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon size={20} />
          Calendrier de maintenance
        </CardTitle>
        <CardDescription>
          Visualisez et gérez vos interventions planifiées
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="flex-1">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={fr}
              className="rounded-md border"
              modifiersClassNames={{
                selected: "bg-primary text-primary-foreground",
              }}
              components={{
                DayContent: ({ date }) => (
                  <div className={`h-full w-full flex items-center justify-center ${getDateClassName(date)}`}>
                    {date.getDate()}
                  </div>
                ),
              }}
            />
          </div>
          <div className="flex-1 min-w-[250px]">
            <h3 className="font-medium text-base mb-2">
              {selectedDate ? (
                `Événements du ${format(selectedDate, 'dd MMMM yyyy', { locale: fr })}`
              ) : (
                'Sélectionnez une date'
              )}
            </h3>
            <div className="space-y-3 mt-3">
              {selectedEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucun événement ce jour</p>
              ) : (
                selectedEvents.map(event => (
                  <div key={event.id} className="rounded-md border p-3 text-sm">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium flex items-center gap-1">
                          {event.title}
                          <Badge variant={event.type === 'preventive' ? 'outline' : 'secondary'} className="ml-1">
                            {event.type === 'preventive' ? 'Préventif' : 'Correctif'}
                          </Badge>
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {event.equipmentName}
                        </p>
                      </div>
                      {getStatusBadge(event.status)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
