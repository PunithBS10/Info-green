import { CountryData, ProcessedCountryData, RegionData, KPIData, MAJOR_COUNTRIES, REGIONS } from '../types/renewable-data';
import { DataCache } from '../lib/cache';

export class RenewableDataService {
  private static async fetchOWIDData(): Promise<string> {
    // Try to use our proxy endpoint first
    try {
      const response = await fetch('/api/owid-proxy');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.text();
    } catch (error) {
      console.warn('Proxy failed, trying direct OWID URL:', error);
      // Fallback to direct URL
      const response = await fetch('https://raw.githubusercontent.com/owid/energy-data/master/owid-energy-data.csv');
      if (!response.ok) {
        throw new Error(`Failed to fetch OWID data: ${response.status}`);
      }
      return await response.text();
    }
  }

  private static parseCSV(csvText: string): CountryData[] {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('Invalid CSV format: insufficient data');
    }

    // Parse header to find column indices
    const header = lines[0].split(',');
    const countryIndex = header.indexOf('country');
    const yearIndex = header.indexOf('year');
    const isoCodeIndex = header.indexOf('iso_code');
    const renewablesShareElecIndex = header.indexOf('renewables_share_elec');
    
    console.log('Header columns found:', { countryIndex, yearIndex, isoCodeIndex, renewablesShareElecIndex });
    
    if (countryIndex === -1 || yearIndex === -1 || renewablesShareElecIndex === -1) {
      console.error('Missing required columns in CSV header:', header.slice(0, 10));
      throw new Error('Required columns not found in CSV');
    }

    const data: CountryData[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const values = line.split(',');
      
      if (values.length > Math.max(countryIndex, yearIndex, renewablesShareElecIndex)) {
        const country = values[countryIndex]?.trim() || '';
        const yearStr = values[yearIndex]?.trim() || '';
        const isoCode = values[isoCodeIndex]?.trim() || '';
        const renewableShareStr = values[renewablesShareElecIndex]?.trim() || '';
        
        const year = parseInt(yearStr);
        
        // Filter to only real countries and exclude aggregated regions
        if (country && !isNaN(year) && year >= 1990 && year <= 2025 && 
            country !== 'World' && !country.includes('(') && !country.includes('Ember') &&
            isoCode && isoCode.length === 3) {
          const renewableShare = renewableShareStr === '' || renewableShareStr === 'null' 
            ? null 
            : parseFloat(renewableShareStr);
          
          if (renewableShare !== null && !isNaN(renewableShare) && renewableShare >= 0 && renewableShare <= 100) {
            try {
              const region = this.getRegionForCountry(country);
              data.push({
                country,
                countryCode: isoCode || undefined,
                year,
                renewableShare,
                region
              });
            } catch (error) {
              console.error(`Error processing country ${country}:`, error);
            }
          }
        }
      }
    }
    
    return data;
  }

  private static getRegionForCountry(country: string): string | undefined {
    try {
      if (!REGIONS || typeof REGIONS !== 'object') {
        console.warn('REGIONS data not available');
        return undefined;
      }
      
      for (const [region, countries] of Object.entries(REGIONS)) {
        if (Array.isArray(countries) && countries.includes(country)) {
          return region;
        }
      }
      return undefined;
    } catch (error) {
      console.error('Error in getRegionForCountry:', error);
      return undefined;
    }
  }

  static async fetchData(forceRefresh = false): Promise<CountryData[]> {
    if (!forceRefresh) {
      const cached = DataCache.getRenewableData();
      if (cached && Array.isArray(cached)) {
        console.log('Using cached data:', cached.length, 'records');
        return cached;
      }
    }

    try {
      console.log('Fetching fresh OWID data...');
      const csvText = await this.fetchOWIDData();
      console.log('CSV text length:', csvText.length);
      const data = this.parseCSV(csvText);
      console.log('Parsed data:', data.length, 'records');
      
      // Save to localStorage cache
      DataCache.setRenewableData(data);
      
      // Also save to backend database
      try {
        console.log('Saving data to backend database...');
        const response = await fetch('/api/renewable-data/import', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data.map(d => ({
            country: d.country,
            countryCode: d.countryCode || null,
            year: d.year,
            renewableShare: d.renewableShare,
            region: d.region || null,
            lastUpdated: new Date().toISOString()
          })))
        });
        
        if (response.ok) {
          console.log('Data successfully saved to backend database');
        } else {
          console.warn('Failed to save to backend database:', response.statusText);
        }
      } catch (error) {
        console.warn('Error saving to backend database:', error);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching renewable data:', error);
      // Return empty array instead of throwing to prevent crashes
      return [];
    }
  }

  static processCountryData(data: CountryData[]): ProcessedCountryData[] {
    if (!data || !Array.isArray(data)) {
      console.log('Invalid data provided to processCountryData');
      return [];
    }

    const countryMap = new Map<string, CountryData[]>();
    
    // Group by country with error handling
    data.forEach(item => {
      if (!item || !item.country) return;
      
      if (!countryMap.has(item.country)) {
        countryMap.set(item.country, []);
      }
      countryMap.get(item.country)!.push(item);
    });

    const processed: ProcessedCountryData[] = [];

    countryMap.forEach((countryData, country) => {
      if (!countryData || countryData.length === 0) return;
      
      // Sort by year descending to get latest
      const sortedData = countryData
        .filter(d => d && d.renewableShare !== null && typeof d.renewableShare === 'number')
        .sort((a, b) => b.year - a.year);

      if (sortedData.length === 0) return;

      const latest = sortedData[0];
      if (!latest) return;
      
      // Calculate growth rate (5-year change)
      const fiveYearsAgo = sortedData.find(d => d && d.year <= latest.year - 5);
      let growthRate: number | undefined;
      
      if (fiveYearsAgo && fiveYearsAgo.renewableShare !== null && latest.renewableShare !== null) {
        growthRate = latest.renewableShare - fiveYearsAgo.renewableShare;
      }

      processed.push({
        country,
        latestYear: latest.year,
        latestValue: latest.renewableShare,
        growthRate,
        region: latest.region || undefined
      });
    });

    // Add rankings
    const ranked = processed
      .filter(d => d && d.latestValue !== null && typeof d.latestValue === 'number')
      .sort((a, b) => (b.latestValue || 0) - (a.latestValue || 0));
    
    ranked.forEach((item, index) => {
      if (item) {
        item.rank = index + 1;
      }
    });

    console.log(`Processed ${processed.length} countries from ${data.length} raw data points`);
    return processed;
  }

  static calculateKPIs(processedData: ProcessedCountryData[]): KPIData {
    const validData = processedData.filter(d => d.latestValue !== null);
    
    const globalAverage = validData.reduce((sum, d) => sum + (d.latestValue || 0), 0) / validData.length;
    const aboveEightyCount = validData.filter(d => (d.latestValue || 0) >= 80).length;
    const belowTwentyCount = validData.filter(d => (d.latestValue || 0) < 20).length;
    
    // Global growth rate calculation
    const validGrowthData = processedData.filter(d => d.growthRate !== undefined);
    const growthRate = validGrowthData.length > 0 
      ? validGrowthData.reduce((sum, d) => sum + (d.growthRate || 0), 0) / validGrowthData.length 
      : 0;
    
    // Fastest growing country
    const fastestGrowing = validGrowthData.reduce((max, current) => 
      (current.growthRate || 0) > (max.growthRate || 0) ? current : max
    , validGrowthData[0] || { country: 'N/A', growthRate: 0 });

    return {
      globalAverage: Math.round(globalAverage * 10) / 10,
      aboveEightyCount,
      belowTwentyCount,
      growthRate: Math.round(growthRate * 10) / 10,
      totalCountries: validData.length,
      fastestGrowing: {
        country: fastestGrowing.country,
        growth: Math.round((fastestGrowing.growthRate || 0) * 10) / 10
      }
    };
  }

  static calculateRegionalData(processedData: ProcessedCountryData[]): RegionData[] {
    const regionMap = new Map<string, ProcessedCountryData[]>();
    
    // Group by region
    processedData.forEach(country => {
      if (country.region && country.latestValue !== null) {
        if (!regionMap.has(country.region)) {
          regionMap.set(country.region, []);
        }
        regionMap.get(country.region)!.push(country);
      }
    });

    const regionalData: RegionData[] = [];

    regionMap.forEach((countries, region) => {
      const average = countries.reduce((sum, c) => sum + (c.latestValue || 0), 0) / countries.length;
      const latestYear = Math.max(...countries.map(c => c.latestYear));

      regionalData.push({
        name: region,
        average: Math.round(average * 10) / 10,
        latestYear,
        countries: countries.map(c => c.country)
      });
    });

    return regionalData.sort((a, b) => b.average - a.average);
  }

  static getMajorCountriesData(processedData: ProcessedCountryData[]): ProcessedCountryData[] {
    return MAJOR_COUNTRIES
      .map(country => processedData.find(d => d.country === country))
      .filter((data): data is ProcessedCountryData => data !== undefined);
  }

  static getTopPerformers(processedData: ProcessedCountryData[], count = 5): ProcessedCountryData[] {
    return processedData
      .filter(d => d.latestValue !== null)
      .sort((a, b) => (b.latestValue || 0) - (a.latestValue || 0))
      .slice(0, count);
  }

  static getBottomPerformers(processedData: ProcessedCountryData[], count = 5): ProcessedCountryData[] {
    return processedData
      .filter(d => d.latestValue !== null)
      .sort((a, b) => (a.latestValue || 0) - (b.latestValue || 0))
      .slice(0, count);
  }
}
