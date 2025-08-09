import { useEffect, useRef } from 'react';
import type { ProcessedCountryData } from '@/types/renewable-data';

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

    // Create a top countries bar chart instead of world map
    const sortedData = data
      .filter(d => d && d.latestValue !== null && d.latestValue !== undefined && d.country)
      .sort((a, b) => (b.latestValue || 0) - (a.latestValue || 0))
      .slice(0, 20); // Top 20 countries

    const option = {
      title: {
        text: 'Top 20 Countries by Renewable Electricity Share',
        left: 'center',
        top: '5%',
        textStyle: {
          fontSize: 16,
          fontWeight: 'normal',
          color: '#374151'
        }
      },
      tooltip: {
        trigger: 'axis',
        formatter: function(params: any) {
          if (params && params.length > 0) {
            const data = params[0];
            return `${data.axisValue}<br/>Renewable: ${data.value?.toFixed(1) || '—'}%`;
          }
          return 'No data available';
        }
      },
      grid: {
        left: '20%',
        right: '10%',
        top: '20%',
        bottom: '10%'
      },
      xAxis: {
        type: 'value',
        max: 100,
        axisLabel: {
          formatter: '{value}%',
          color: '#6b7280'
        },
        axisLine: {
          lineStyle: { color: '#e5e7eb' }
        }
      },
      yAxis: {
        type: 'category',
        data: sortedData.map(d => d.country),
        axisLabel: {
          fontSize: 11,
          color: '#6b7280'
        },
        axisLine: {
          lineStyle: { color: '#e5e7eb' }
        }
      },
      series: [{
        name: 'Renewable Electricity %',
        type: 'bar',
        data: sortedData.map(d => d.latestValue),
        itemStyle: {
          color: function(params: any) {
            const value = params.value;
            if (value >= 80) return '#059669';
            if (value >= 60) return '#10b981';
            if (value >= 40) return '#34d399';
            if (value >= 20) return '#6ee7b7';
            return '#a7f3d0';
          }
        },
        barMaxWidth: 20
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
      <div className="h-[400px] flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
        <div className="text-muted-foreground">Loading chart...</div>
      </div>
    );
  }

  return <div ref={chartRef} className="h-[400px] w-full" />;
}