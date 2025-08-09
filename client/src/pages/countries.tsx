import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { Trophy, AlertTriangle, Rocket, Globe } from "lucide-react";
import { RenewableDataService } from '../services/renewable-data';
import { Header } from '../components/layout/header';
import { KPICard } from '../components/ui/kpi-card';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Countries() {
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

  const majorCountriesData = React.useMemo(() => {
    if (processedData.length === 0) return [];
    return RenewableDataService.getMajorCountriesData(processedData);
  }, [processedData]);

  const topPerformers = React.useMemo(() => {
    if (processedData.length === 0) return [];
    return RenewableDataService.getTopPerformers(processedData);
  }, [processedData]);

  const bottomPerformers = React.useMemo(() => {
    if (processedData.length === 0) return [];
    return RenewableDataService.getBottomPerformers(processedData);
  }, [processedData]);

  const handleRefresh = () => {
    refetch();
  };

  const isDataLoading = isLoading || isRefetching;

  const formatValue = (value: number | null) => {
    return value !== null ? `${value.toFixed(1)}%` : "—";
  };

  return (
    <div className="flex-1 overflow-auto">
      <Header 
        title="Countries Renewable Electricity Dashboard" 
        onRefresh={handleRefresh}
        isRefreshing={isDataLoading}
      />
      
      <div className="p-6">
        {/* KPI Cards for Countries */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            label="Above 80% Countries"
            value={kpiData?.aboveEightyCount || "—"}
            subtitle="High renewable adoption"
            icon={Trophy}
            isLoading={isDataLoading}
          />
          
          <KPICard
            label="Below 20% Countries"
            value={kpiData?.belowTwentyCount || "—"}
            subtitle="Need improvement"
            icon={AlertTriangle}
            isLoading={isDataLoading}
          />
          
          <KPICard
            label="Fastest Growing"
            value={kpiData?.fastestGrowing.country || "—"}
            change={kpiData?.fastestGrowing.growth ? `+${kpiData.fastestGrowing.growth}%` : undefined}
            subtitle="2018-2023 period"
            icon={Rocket}
            isLoading={isDataLoading}
            changeType="positive"
          />
          
          <KPICard
            label="Total Countries"
            value={kpiData?.totalCountries || "—"}
            subtitle="With renewable data"
            icon={Globe}
            isLoading={isDataLoading}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Major Countries Grid */}
          <Card className="lg:col-span-2 bg-white dark:bg-card border border-gray-100 dark:border-border">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Major Countries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isDataLoading ? (
                  Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-3 w-12" />
                      </div>
                      <Skeleton className="h-5 w-12" />
                    </div>
                  ))
                ) : (
                  majorCountriesData.map((country) => (
                    <div 
                      key={country.country} 
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-100">
                          {country.country}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {country.latestYear}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-semibold text-primary">
                          {formatValue(country.latestValue)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Top and Bottom Performers */}
          <div className="space-y-6">
            {/* Top Performers */}
            <Card className="bg-white dark:bg-card border border-gray-100 dark:border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    Top Performers
                  </CardTitle>
                  <span className="text-sm text-gray-500 dark:text-gray-400">2023</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Highest renewable electricity share
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {isDataLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Skeleton className="w-6 h-6 rounded-full" />
                          <div>
                            <Skeleton className="h-4 w-20 mb-1" />
                            <Skeleton className="h-3 w-12" />
                          </div>
                        </div>
                        <Skeleton className="h-4 w-12" />
                      </div>
                    ))
                  ) : (
                    topPerformers.map((country, index) => (
                      <div key={country.country} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center">
                            #{index + 1}
                          </span>
                          <div>
                            <p className="font-medium text-gray-800 dark:text-gray-100">
                              {country.country}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {country.latestYear}
                            </p>
                          </div>
                        </div>
                        <span className="font-semibold text-primary">
                          {formatValue(country.latestValue)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Bottom Performers */}
            <Card className="bg-white dark:bg-card border border-gray-100 dark:border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    Bottom Performers
                  </CardTitle>
                  <span className="text-sm text-gray-500 dark:text-gray-400">2023</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Lowest renewable electricity share
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {isDataLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Skeleton className="w-6 h-6 rounded-full" />
                          <div>
                            <Skeleton className="h-4 w-20 mb-1" />
                            <Skeleton className="h-3 w-12" />
                          </div>
                        </div>
                        <Skeleton className="h-4 w-12" />
                      </div>
                    ))
                  ) : (
                    bottomPerformers.map((country, index) => {
                      const totalCountries = processedData.filter(d => d.latestValue !== null).length;
                      const rank = totalCountries - bottomPerformers.length + index + 1;
                      
                      return (
                        <div key={country.country} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                              #{rank}
                            </span>
                            <div>
                              <p className="font-medium text-gray-800 dark:text-gray-100">
                                {country.country}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {country.latestYear}
                              </p>
                            </div>
                          </div>
                          <span className="font-semibold text-red-500">
                            {formatValue(country.latestValue)}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
