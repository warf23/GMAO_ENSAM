
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, AlertCircle, CheckCircle, Clock, ChevronRight } from 'lucide-react';
import { format, isSameDay, startOfToday, isToday, isPast, isFuture } from 'date-fns';
import { fr } from 'date-fns/locale';
import { MaintenanceEvent } from '@/types/maintenance';

type MaintenanceCalendarProps = {
  events: MaintenanceEvent[];
};

export const MaintenanceCalendar = ({ events }: MaintenanceCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(startOfToday());
  
  const getDateClassName = (date: Date) => {
    const eventsForDate = events.filter(event => isSameDay(date, new Date(event.date)));
    
    if (eventsForDate.length === 0) return '';
    
    const hasOverdue = eventsForDate.some(e => e.status === 'overdue');
    const hasInProgress = eventsForDate.some(e => e.status === 'in-progress');
    const allCompleted = eventsForDate.every(e => e.status === 'completed');
    
    if (hasOverdue) return 'bg-destructive/10 text-destructive hover:bg-destructive/20 font-bold';
    if (hasInProgress) return 'bg-primary/10 text-primary hover:bg-primary/20 font-bold';
    if (allCompleted) return 'bg-success/10 text-success hover:bg-success/20 font-bold';
    return 'bg-primary/10 text-primary hover:bg-primary/20 font-bold';
  };
  
  const getEventsForSelectedDate = () => {
    if (!selectedDate) return [];
    return events
      .filter(event => isSameDay(new Date(event.date), selectedDate))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const selectedEvents = getEventsForSelectedDate();

  const getStatusBadge = (status: string, date: Date) => {
    if (status === 'completed') {
      return (
        <Badge className="bg-success/10 text-success hover:bg-success/20">
          <CheckCircle size={14} className="mr-1" />
          Terminé
        </Badge>
      );
    }
    if (status === 'in-progress') {
      return (
        <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
          <Clock size={14} className="mr-1" />
          En cours
        </Badge>
      );
    }
    if (status === 'overdue' || (status === 'planned' && isPast(date) && !isToday(date))) {
      return (
        <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/20">
          <AlertCircle size={14} className="mr-1" />
          En retard
        </Badge>
      );
    }
    return (
      <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
        <Clock size={14} className="mr-1" />
        Planifié
      </Badge>
    );
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <CalendarDays size={18} />
          Calendrier de maintenance
        </CardTitle>
        <CardDescription>
          {events.length} interventions planifiées
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={fr}
              className="rounded-md border"
              classNames={{
                day_today: "bg-muted font-bold",
              }}
              components={{
                DayContent: ({ date }) => (
                  <div className={`h-full w-full flex items-center justify-center rounded-md ${getDateClassName(date)}`}>
                    {date.getDate()}
                  </div>
                ),
              }}
            />
          </div>
          <div className="flex-1 min-w-[280px]">
            <h3 className="font-medium text-sm flex items-center gap-2 mb-3">
              {selectedDate ? (
                <>
                  <ChevronRight size={16} />
                  Événements du {format(selectedDate, 'dd MMMM yyyy', { locale: fr })}
                </>
              ) : (
                'Sélectionnez une date'
              )}
            </h3>
            <div className="space-y-3">
              {selectedEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucun événement ce jour</p>
              ) : (
                selectedEvents.map(event => (
                  <div 
                    key={event.id} 
                    className="rounded-lg border p-3 text-sm hover:bg-muted/50 transition-colors"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-medium flex items-center gap-1">
                            {event.title}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            {event.equipmentName}
                          </p>
                        </div>
                        {getStatusBadge(event.status, new Date(event.date))}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={event.type === 'preventive' ? 'outline' : 'secondary'} className="text-xs">
                          {event.type === 'preventive' ? 'Préventif' : 'Correctif'}
                        </Badge>
                      </div>
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
