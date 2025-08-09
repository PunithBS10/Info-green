import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  label: string;
  value: string | number;
  change?: string | number;
  subtitle?: string;
  icon: LucideIcon;
  isLoading?: boolean;
  changeType?: 'positive' | 'negative' | 'neutral';
}

export function KPICard({ 
  label, 
  value, 
  change, 
  subtitle, 
  icon: Icon, 
  isLoading = false,
  changeType = 'neutral'
}: KPICardProps) {
  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-card border border-gray-100 dark:border-border">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-5" />
          </div>
          <div className="flex items-end space-x-2">
            <Skeleton className="h-9 w-16" />
            <Skeleton className="h-5 w-12" />
          </div>
          <Skeleton className="h-3 w-20 mt-1" />
        </CardContent>
      </Card>
    );
  }

  const getChangeColor = () => {
    switch (changeType) {
      case 'positive': return 'text-green-600 dark:text-green-400';
      case 'negative': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <Card className="bg-white dark:bg-card border border-gray-100 dark:border-border shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="flex items-end space-x-2">
          <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </span>
          {change && (
            <span className={`text-sm font-medium ${getChangeColor()}`}>
              {typeof change === 'number' 
                ? `${change > 0 ? '+' : ''}${change}%`
                : change}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}
