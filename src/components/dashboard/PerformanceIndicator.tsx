
import { Gauge } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

type PerformanceIndicatorProps = {
  title: string;
  value: number;
  target?: number;
  unit: string;
  description?: string;
  status?: 'success' | 'warning' | 'danger';
};

export const PerformanceIndicator = ({
  title,
  value,
  target = 100,
  unit,
  description,
  status = 'success',
}: PerformanceIndicatorProps) => {
  const percentage = Math.min(Math.round((value / target) * 100), 100);
  
  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'danger':
        return 'text-destructive';
      default:
        return 'text-primary';
    }
  };
  
  const getProgressColor = () => {
    switch (status) {
      case 'success':
        return 'bg-success';
      case 'warning':
        return 'bg-warning';
      case 'danger':
        return 'bg-destructive';
      default:
        return 'bg-primary';
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Gauge size={18} />
          {title}
        </CardTitle>
        {description && (
          <CardDescription className="text-xs">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="flex items-end">
            <span className={`text-3xl font-bold ${getStatusColor()}`}>
              {value}
            </span>
            <span className="ml-1 text-sm text-muted-foreground">
              {unit}
            </span>
          </div>
          
          <div className="w-full flex items-center gap-2">
            <Progress value={percentage} className={`h-2 ${getProgressColor()}`} />
            <span className="text-xs font-medium">{percentage}%</span>
          </div>
          
          {target && (
            <div className="text-xs text-muted-foreground">
              Objectif: {target} {unit}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
