import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, AlertCircle, CheckCircle, Clock, ChevronRight } from 'lucide-react';
import { format, isSameDay, startOfToday, isToday, isPast, isFuture } from 'date-fns';
import { fr } from 'date-fns/locale';
import { MaintenanceEvent } from '@/types/maintenance';
import { DayPicker } from '../../components/ui/day-picker';
import { cn } from '@/lib/utils';

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
    <div className="rounded-lg border bg-card shadow-sm" data-chart="calendar">
      <div className="flex flex-col space-y-3 p-4">
        <h3 className="text-lg font-medium">Calendrier de maintenance</h3>
        <div className="overflow-hidden rounded-md border">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            modifiers={{ 
              event: events.filter(event => event.date).map(event => new Date(event.date))
            }}
            modifiersStyles={{
              event: {
                fontWeight: 'bold',
                color: 'white',
                backgroundColor: '#007BFF',
                borderRadius: '50%',
              }
            }}
            showOutsideDays
            className="p-3"
            footer={selectedDate ? (
              <p className="py-2 text-sm text-center text-muted-foreground">
                Événements du {format(selectedDate, 'dd MMMM yyyy', { locale: fr })}
              </p>
            ) : null}
          />
        </div>
      </div>
      
      {selectedEvents.length > 0 && (
        <div className="border-t p-4">
          <div className="space-y-4">
            {selectedEvents.map(event => (
              <div 
                key={event.id} 
                className="flex items-start space-x-3"
              >
                <div className={cn(
                  "mt-0.5 h-4 w-4 rounded-full", 
                  event.type === 'preventive' ? 'bg-blue-500' : 'bg-amber-500'
                )} />
                <div className="space-y-1 flex-1">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-medium leading-none">{event.title}</p>
                    <div className={cn(
                      "text-xs font-medium rounded-full px-2 py-0.5", 
                      getDateClassName(new Date(event.date))
                    )}>
                      {getStatusBadge(event.status, new Date(event.date))}
                    </div>
                  </div>
                  {event.technicians && (
                    <p className="text-xs text-muted-foreground">
                      Technicien{event.technicians.length > 1 ? 's' : ''}: {event.technicians.join(', ')}
                    </p>
                  )}
                  {event.duration && (
                    <p className="text-xs text-muted-foreground">
                      Durée estimée: {event.duration} heure{event.duration > 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
