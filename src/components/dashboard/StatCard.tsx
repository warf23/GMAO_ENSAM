
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type StatCardProps = {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
  iconClassName?: string;
};

export const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendValue,
  className,
  iconClassName,
}: StatCardProps) => {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="mt-2 text-2xl font-bold">{value}</h3>
          {description && (
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          )}
          {trend && (
            <div 
              className={cn(
                "mt-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                trend === "up" && "bg-success/10 text-success",
                trend === "down" && "bg-destructive/10 text-destructive",
                trend === "neutral" && "bg-muted text-muted-foreground"
              )}
            >
              {trend === "up" && <span className="mr-1">↑</span>}
              {trend === "down" && <span className="mr-1">↓</span>}
              {trendValue}
            </div>
          )}
        </div>
        <div 
          className={cn(
            "rounded-full p-2 bg-primary/10 text-primary",
            iconClassName
          )}
        >
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
};
