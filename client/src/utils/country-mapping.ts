// Country name mapping: OWID → GeoJSON names
export const COUNTRY_NAME_MAPPING: Record<string, string> = {
  // Key mappings based on actual GeoJSON country names
  'United States': 'USA', // GeoJSON uses 'USA' not 'United States of America'
  'United Kingdom': 'England', // GeoJSON uses 'England' not 'United Kingdom'
  'Russia': 'Russia', // Direct match
  'Iran': 'Iran',
  'Venezuela': 'Venezuela',
  'Bolivia': 'Bolivia',
  'Tanzania': 'Tanzania', // GeoJSON uses 'Tanzania'
  'Syria': 'Syria', // GeoJSON uses 'Syria' 
  'Laos': 'Laos', // GeoJSON uses 'Laos'
  'North Korea': 'North Korea', // GeoJSON uses 'North Korea'
  'South Korea': 'South Korea', // GeoJSON uses 'South Korea'
  'Moldova': 'Moldova', // GeoJSON uses 'Moldova'
  'Macedonia': 'Macedonia', // GeoJSON uses 'Macedonia'
  'Congo': 'Republic of Congo', // GeoJSON variation
  'Democratic Republic of Congo': 'Democratic Republic of the Congo',
  'Central African Republic': 'Central African Republic',
  'Cote d\'Ivoire': 'Ivory Coast', // GeoJSON uses 'Ivory Coast'
  'Ivory Coast': 'Ivory Coast',
  'Brunei': 'Brunei',
  'East Timor': 'East Timor',
  'Timor': 'East Timor',
  'Timor-Leste': 'East Timor',
  'Swaziland': 'Swaziland', // Check if GeoJSON uses this
  'Eswatini': 'Swaziland',
  'Myanmar': 'Myanmar',
  'Burma': 'Myanmar',
  'Cape Verde': 'Cape Verde',
  'Gambia': 'Gambia', // GeoJSON uses 'Gambia'
  'Vatican': 'Vatican',
  'Micronesia (country)': 'Micronesia',
  'Palestine': 'Palestine',
  'Taiwan': 'Taiwan',
  'Serbia': 'Serbia',
  'Montenegro': 'Montenegro',
  'Kosovo': 'Kosovo',
  'South Sudan': 'South Sudan',
  'Czech Republic': 'Czech Republic',
  'Slovakia': 'Slovakia',
  'Bosnia and Herzegovina': 'Bosnia and Herzegovina',
  
  // Additional common variations - these are the key missing mappings
  'USA': 'United States of America',
  'UK': 'United Kingdom',
  'UAE': 'United Arab Emirates',  
  'DRC': 'Democratic Republic of the Congo',
  'CAR': 'Central African Republic',
  
  // Small island nations and territories that appear in OWID but not GeoJSON
  'Bahrain': 'Bahrain',
  'Barbados': 'Barbados',
  'Cayman Islands': 'Cayman Islands',
  'Bermuda': 'Bermuda',
  'British Virgin Islands': 'British Virgin Islands',
  'American Samoa': 'American Samoa',
  'Antigua and Barbuda': 'Antigua and Barbuda',
  'Aruba': 'Aruba'
};

// Reverse mapping for flexibility
export const REVERSE_COUNTRY_MAPPING: Record<string, string> = {};
Object.entries(COUNTRY_NAME_MAPPING).forEach(([owid, geo]) => {
  REVERSE_COUNTRY_MAPPING[geo] = owid;
});

/**
 * Maps OWID country name to world map country name
 */
export function mapOWIDToGeoName(owidName: string): string {
  return COUNTRY_NAME_MAPPING[owidName] || owidName;
}

/**
 * Maps world map country name to OWID country name
 */
export function mapGeoToOWIDName(geoName: string): string {
  return REVERSE_COUNTRY_MAPPING[geoName] || geoName;
}

/**
 * Gets all possible name variations for a country
 */
export function getCountryNameVariations(countryName: string): string[] {
  const variations = [countryName];
  
  // Add mapped version
  const mapped = COUNTRY_NAME_MAPPING[countryName];
  if (mapped && !variations.includes(mapped)) {
    variations.push(mapped);
  }
  
  // Add reverse mapped version
  const reverseMapped = REVERSE_COUNTRY_MAPPING[countryName];
  if (reverseMapped && !variations.includes(reverseMapped)) {
    variations.push(reverseMapped);
  }
  
  return variations;
}