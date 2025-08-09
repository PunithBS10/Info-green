import React from 'react';
import { Header } from '../components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useTheme } from '@/hooks/use-theme';
import { DataCache } from '@/lib/cache';
import { useToast } from '@/hooks/use-toast';
import { Trash2 } from 'lucide-react';

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [cacheEnabled, setCacheEnabled] = React.useState(true);
  const [refreshInterval, setRefreshInterval] = React.useState('manual');

  const cacheStatus = React.useMemo(() => {
    return DataCache.getCacheStatus();
  }, []);

  const handleClearCache = () => {
    DataCache.clearCache();
    toast({
      title: "Cache Cleared",
      description: "Local data cache has been cleared successfully.",
    });
  };

  const formatCacheAge = (age: number) => {
    const hours = Math.floor(age / (1000 * 60 * 60));
    const minutes = Math.floor((age % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ago`;
    }
    return `${minutes}m ago`;
  };

  return (
    <div className="flex-1 overflow-auto">
      <Header title="Dashboard Settings" />
      
      <div className="p-6">
        <div className="max-w-4xl">
          <Card className="bg-white dark:bg-card border border-gray-100 dark:border-border">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theme Settings */}
              <div className="space-y-2">
                <Label htmlFor="theme" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Theme
                </Label>
                <Select value={theme} onValueChange={(value: any) => setTheme(value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Choose your preferred color scheme
                </p>
              </div>

              {/* Data Refresh Interval */}
              <div className="space-y-2">
                <Label htmlFor="refresh" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Data Refresh Interval
                </Label>
                <Select value={refreshInterval} onValueChange={setRefreshInterval}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  How often to automatically refresh data from OWID
                </p>
              </div>

              {/* Cache Settings */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="cache" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Enable local data caching
                    </Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Cache data locally to reduce API calls and improve performance
                    </p>
                  </div>
                  <Switch
                    id="cache"
                    checked={cacheEnabled}
                    onCheckedChange={setCacheEnabled}
                  />
                </div>

                {/* Cache Status */}
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Cache Status
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      cacheStatus.hasCache 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {cacheStatus.hasCache ? 'Active' : 'Empty'}
                    </span>
                  </div>
                  
                  {cacheStatus.hasCache && cacheStatus.age && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Last updated: {formatCacheAge(cacheStatus.age)}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Cache expires after 24 hours
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearCache}
                      disabled={!cacheStatus.hasCache}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Clear Cache
                    </Button>
                  </div>
                </div>
              </div>

              {/* Data Source Info */}
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
                  Data Source Information
                </h4>
                <div className="space-y-1 text-xs text-blue-700 dark:text-blue-300">
                  <p>• Data sourced from Our World in Data (OWID)</p>
                  <p>• Renewable electricity share includes hydro, solar, wind, and other renewables</p>
                  <p>• Updated regularly by OWID from official government sources</p>
                  <p>• Missing data points are handled gracefully (shown as "—")</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
