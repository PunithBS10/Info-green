import React, { useEffect, useRef } from 'react';
import { ProcessedCountryData } from '../../types/renewable-data';

interface WorldMapProps {
  data: ProcessedCountryData[];
  isLoading?: boolean;
}

export function WorldMap({ data, isLoading = false }: WorldMapProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<any>(null);

  useEffect(() => {
    if (!chartRef.current || isLoading || !data || data.length === 0) return;

    // Initialize ECharts
    const echarts = (window as any).echarts;
    if (!echarts) {
      console.error('ECharts not loaded');
      return;
    }

    // Dispose previous instance
    if (chartInstance.current) {
      chartInstance.current.dispose();
    }

    chartInstance.current = echarts.init(chartRef.current);

    // Prepare data for map
    const mapData = data
      .filter(d => d.latestValue !== null)
      .map(d => ({
        name: d.country,
        value: d.latestValue,
        year: d.latestYear,
        rank: d.rank || 0
      }));

    const option = {
      tooltip: {
        trigger: 'item',
        formatter: function(params: any) {
          if (params.data) {
            return `${params.name}<br/>Renewable: ${params.data.value?.toFixed(1) || '—'}%<br/>Year: ${params.data.year}<br/>Rank: #${params.data.rank}`;
          }
          return `${params.name}<br/>No data available`;
        }
      },
      visualMap: {
        min: 0,
        max: 100,
        left: 'left',
        top: 'bottom',
        text: ['High', 'Low'],
        calculable: true,
        inRange: {
          color: ['#fee2e2', '#fef3c7', '#d1fae5', '#a7f3d0', '#10b981']
        },
        textStyle: {
          color: '#666'
        }
      },
      series: [{
        name: 'Renewable Electricity %',
        type: 'map',
        map: 'world',
        roam: true,
        data: mapData,
        emphasis: {
          label: {
            show: false
          }
        }
      }]
    };

    chartInstance.current.setOption(option);

    // Handle resize
    const handleResize = () => {
      if (chartInstance.current) {
        chartInstance.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }
    };
  }, [data, isLoading]);

  if (isLoading) {
    return (
      <div className="h-96 w-full bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">Loading world map...</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div ref={chartRef} className="h-96 w-full" />
      
      {/* Map Legend */}
      <div className="flex items-center justify-center mt-4 space-x-4">
        <span className="text-xs text-gray-500 dark:text-gray-400">0%</span>
        <div className="flex space-x-1">
          <div className="w-4 h-3 bg-red-100"></div>
          <div className="w-4 h-3 bg-yellow-100"></div>
          <div className="w-4 h-3 bg-green-100"></div>
          <div className="w-4 h-3 bg-green-300"></div>
          <div className="w-4 h-3 bg-primary"></div>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">100%</span>
      </div>
    </div>
  );
}
