import { useEffect, useRef } from 'react';
import type { ProcessedCountryData } from '@/types/renewable-data';
import { mapOWIDToGeoName } from '@/utils/country-mapping';

interface WorldMapProps {
  data: ProcessedCountryData[];
  isLoading?: boolean;
}

export function WorldMap({ data, isLoading = false }: WorldMapProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<any>(null);

  useEffect(() => {
    if (!chartRef.current || isLoading || !data || data.length === 0) return;

    // Load ECharts world map
    const loadWorldMap = async () => {
      const echarts = (window as any).echarts;
      if (!echarts) {
        console.error('ECharts not loaded');
        return;
      }

      try {
        // Load world map GeoJSON data
        const worldMapUrl = 'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson';
        const response = await fetch(worldMapUrl);
        const worldGeoJson = await response.json();
        
        // Log all available country names in the GeoJSON for debugging
        const geoCountries = worldGeoJson.features?.map((feature: any) => feature.properties?.NAME || feature.properties?.name).filter(Boolean) || [];
        console.log('Available countries in GeoJSON:', geoCountries.sort());
        
        // Log OWID countries to compare  
        const owidCountries = data.map(d => d.country).sort();
        console.log('OWID countries:', owidCountries.slice(0, 20)); // Show first 20
        
        // Check if USA/UK exist in OWID data
        const hasUSA = owidCountries.find(c => c.toLowerCase().includes('united states') || c === 'USA');
        const hasUK = owidCountries.find(c => c.toLowerCase().includes('united kingdom') || c === 'UK');
        console.log('USA variant in OWID:', hasUSA);
        console.log('UK variant in OWID:', hasUK);
        
        // Register the world map
        echarts.registerMap('world', worldGeoJson);

        // Dispose previous instance
        if (chartInstance.current) {
          chartInstance.current.dispose();
        }

        chartInstance.current = echarts.init(chartRef.current);

        // Prepare data for map with country name mapping
        const mapData = data
          .filter(d => d && d.latestValue !== null && d.latestValue !== undefined && d.country)
          .map(d => {
            const mappedName = mapOWIDToGeoName(d.country);
            
            // Log if country name was mapped (for debugging)
            if (mappedName !== d.country) {
              console.log(`Country mapped: "${d.country}" → "${mappedName}"`);
            }
            
            return {
              name: mappedName, // Map OWID names to GeoJSON names
              value: d.latestValue,
              year: d.latestYear || 2023,
              rank: d.rank || 0,
              originalName: d.country // Keep original name for tooltip
            };
          });

        console.log(`Preparing map data for ${mapData.length} countries with renewable data`);
        
        // Log countries that might not match for debugging
        const unmatchedOWID = data
          .filter(d => d && d.latestValue !== null)
          .map(d => d.country)
          .filter(country => {
            const mapped = mapOWIDToGeoName(country);
            return !geoCountries.includes(mapped);
          });
        
        if (unmatchedOWID.length > 0) {
          console.log('OWID countries not found in GeoJSON (first 10):', unmatchedOWID.slice(0, 10));
        }

        const option = {
          tooltip: {
            trigger: 'item',
            formatter: function(params: any) {
              if (params.data && params.data.value !== undefined) {
                const displayName = params.data.originalName || params.name;
                return `${displayName}<br/>Renewable: ${params.data.value?.toFixed(1)}%<br/>Year: ${params.data.year}<br/>Global Rank: #${params.data.rank}`;
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
              color: ['#f3f4f6', '#d1fae5', '#a7f3d0', '#6ee7b7', '#34d399', '#10b981', '#059669']
            },
            textStyle: {
              color: '#6b7280'
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
                show: true,
                fontSize: 12
              },
              itemStyle: {
                areaColor: '#059669',
                borderColor: '#ffffff',
                borderWidth: 2
              }
            },
            itemStyle: {
              borderColor: '#ffffff',
              borderWidth: 0.5
            },
            label: {
              show: false
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

        // Cleanup function
        return () => {
          window.removeEventListener('resize', handleResize);
          if (chartInstance.current) {
            chartInstance.current.dispose();
          }
        };

      } catch (error) {
        console.error('Failed to load world map:', error);
        // Fallback to a simple text display
        if (chartRef.current) {
          chartRef.current.innerHTML = `
            <div class="h-full w-full flex flex-col items-center justify-center text-gray-500">
              <div class="text-lg font-medium mb-2">World Map</div>
              <div class="text-sm">Map data loading failed</div>
              <div class="text-xs mt-4">Top countries with renewable electricity:</div>
              <div class="mt-2 space-y-1">
                ${data.slice(0, 5).map(d => 
                  `<div class="text-xs">${d.country}: ${d.latestValue?.toFixed(1)}%</div>`
                ).join('')}
              </div>
            </div>
          `;
        }
      }
    };

    loadWorldMap();
  }, [data, isLoading]);

  if (isLoading) {
    return (
      <div className="h-[400px] flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
        <div className="text-muted-foreground">Loading world map...</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div ref={chartRef} className="h-[400px] w-full" />
    </div>
  );
}