const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export interface CacheItem<T> {
  data: T;
  timestamp: number;
}

export class DataCache {
  private static getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      
      const cached: CacheItem<T> = JSON.parse(item);
      const now = Date.now();
      
      if (now - cached.timestamp > CACHE_DURATION) {
        localStorage.removeItem(key);
        return null;
      }
      
      return cached.data;
    } catch (error) {
      console.error('Error reading from cache:', error);
      return null;
    }
  }

  private static setItem<T>(key: string, data: T): void {
    try {
      const item: CacheItem<T> = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.error('Error writing to cache:', error);
    }
  }

  static getRenewableData(): any[] | null {
    return this.getItem<any[]>('renewable_data');
  }

  static setRenewableData(data: any[]): void {
    this.setItem('renewable_data', data);
  }

  static clearCache(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('renewable_') || key === 'owid_data') {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  static getCacheStatus(): { hasCache: boolean; age?: number } {
    const cached = localStorage.getItem('renewable_data');
    if (!cached) return { hasCache: false };
    
    try {
      const item = JSON.parse(cached);
      return {
        hasCache: true,
        age: Date.now() - item.timestamp
      };
    } catch {
      return { hasCache: false };
    }
  }
}
