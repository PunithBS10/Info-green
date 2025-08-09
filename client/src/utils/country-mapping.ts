// Country name mapping to match OWID data with world map GeoJSON
export const COUNTRY_NAME_MAPPING: Record<string, string> = {
  // Common country name variations
  'United States': 'United States of America',
  'United Kingdom': 'United Kingdom',
  'Russia': 'Russian Federation',
  'Iran': 'Iran',
  'Venezuela': 'Venezuela',
  'Bolivia': 'Bolivia',
  'Tanzania': 'United Republic of Tanzania',
  'Syria': 'Syrian Arab Republic',
  'Laos': "Lao People's Democratic Republic",
  'North Korea': "Democratic People's Republic of Korea",
  'South Korea': 'Republic of Korea',
  'Moldova': 'Republic of Moldova',
  'Macedonia': 'North Macedonia',
  'Congo': 'Republic of the Congo',
  'Democratic Republic of Congo': 'Democratic Republic of the Congo',
  'Central African Republic': 'Central African Republic',
  'Cote d\'Ivoire': 'Côte d\'Ivoire',
  'Ivory Coast': 'Côte d\'Ivoire',
  'Brunei': 'Brunei Darussalam',
  'East Timor': 'East Timor',
  'Timor': 'East Timor',
  'Swaziland': 'Eswatini',
  'Eswatini': 'Eswatini',
  'Myanmar': 'Myanmar',
  'Burma': 'Myanmar',
  'Cape Verde': 'Cape Verde',
  'Gambia': 'The Gambia',
  'Bahamas': 'The Bahamas',
  'Vatican': 'Vatican City',
  'Micronesia (country)': 'Federated States of Micronesia',
  'Palestine': 'Palestine',
  'Taiwan': 'Taiwan',
  'Serbia': 'Serbia',
  'Montenegro': 'Montenegro',
  'Kosovo': 'Kosovo',
  'South Sudan': 'South Sudan',
  
  // Additional mappings for common variations
  'USA': 'United States of America',
  'UK': 'United Kingdom',
  'UAE': 'United Arab Emirates',
  'DRC': 'Democratic Republic of the Congo',
  'CAR': 'Central African Republic'
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