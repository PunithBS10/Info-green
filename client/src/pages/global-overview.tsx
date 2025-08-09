import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, Trophy, Globe, BarChart3 } from "lucide-react";
import { RenewableDataService } from '../services/renewable-data';
import { Header } from '../components/layout/header';
import { KPICard } from '../components/ui/kpi-card';
import { WorldMap } from '../components/charts/world-map';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

export default function GlobalOverview() {
  const { data: rawData, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['/api/renewable-data'],
    queryFn: () => RenewableDataService.fetchData(),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });

  const processedData = React.useMemo(() => {
    if (!rawData) return [];
    try {
      return RenewableDataService.processCountryData(rawData);
    } catch (error) {
      console.error('Error processing country data:', error);
      return [];
    }
  }, [rawData]);

  const kpiData = React.useMemo(() => {
    if (processedData.length === 0) return null;
    return RenewableDataService.calculateKPIs(processedData);
  }, [processedData]);

  const regionData = React.useMemo(() => {
    if (processedData.length === 0) return [];
    return RenewableDataService.calculateRegionalData(processedData);
  }, [processedData]);

  const handleRefresh = () => {
    // Force a fresh data fetch that will save to database
    localStorage.removeItem('renewable_data_cache');
    localStorage.removeItem('renewable_data_cache_timestamp');
    refetch();
  };

  const isDataLoading = isLoading || isRefetching;

  if (isLoading && !rawData) {
    return (
      <div className="flex-1 overflow-auto">
        <Header 
          title="Global Renewable Electricity Dashboard" 
          onRefresh={handleRefresh}
          isRefreshing={isDataLoading}
        />
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <KPICard 
                key={i}
                label="Loading..."
                value="—"
                icon={Globe}
                isLoading={true}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <Header 
        title="Global Renewable Electricity Dashboard" 
        onRefresh={handleRefresh}
        isRefreshing={isDataLoading}
      />
      
      <div className="p-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            label="Global Average"
            value={kpiData ? `${kpiData.globalAverage}%` : "—"}
            change={kpiData?.growthRate}
            subtitle="Latest year renewable share"
            icon={BarChart3}
            isLoading={isDataLoading}
            changeType={kpiData && kpiData.growthRate > 0 ? 'positive' : 'neutral'}
          />
          
          <KPICard
            label="Above 80% Countries"
            value={kpiData?.aboveEightyCount || "—"}
            subtitle="Leading renewable adoption"
            icon={Trophy}
            isLoading={isDataLoading}
          />
          
          <KPICard
            label="Growing Rate"
            value={kpiData ? `+${kpiData.growthRate}%` : "—"}
            subtitle="5-year global change"
            icon={TrendingUp}
            isLoading={isDataLoading}
            changeType="positive"
          />
          
          <KPICard
            label="Countries"
            value={kpiData?.totalCountries || "—"}
            subtitle="With renewable data"
            icon={Globe}
            isLoading={isDataLoading}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* World Map */}
          <Card className="lg:col-span-2 bg-white dark:bg-card border border-gray-100 dark:border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  World Map
                </CardTitle>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  % Renewable Electricity
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <WorldMap data={processedData} isLoading={isDataLoading} />
            </CardContent>
          </Card>

          {/* Regions List */}
          <Card className="bg-white dark:bg-card border border-gray-100 dark:border-border">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Regions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isDataLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between py-3">
                      <div>
                        <Skeleton className="h-4 w-20 mb-1" />
                        <Skeleton className="h-3 w-12" />
                      </div>
                      <div className="text-right">
                        <Skeleton className="h-4 w-12 mb-1" />
                        <Skeleton className="h-2 w-20" />
                      </div>
                    </div>
                  ))
                ) : (
                  regionData.map((region, index) => (
                    <div 
                      key={region.name} 
                      className={`flex items-center justify-between py-3 ${
                        index < regionData.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''
                      }`}
                    >
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-100">
                          {region.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {region.latestYear}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-500">
                          {region.average.toFixed(1)}%
                        </p>
                        <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all" 
                            style={{ width: `${Math.min(region.average, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
