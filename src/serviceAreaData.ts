import zipLocations from './service-area-zips.json';

// Shared source for map markers and estimate validation. Coordinates are
// approximate postal locations from GeoNames (CC BY 4.0), retrieved 2026-09-09:
// https://download.geonames.org/export/zip/US.zip
export const SERVICE_AREA_LOCATIONS = zipLocations;
export const SERVICE_AREA_ZIP_CODES = SERVICE_AREA_LOCATIONS.map(({ zip }) => zip);

export const isZipInServiceArea = (zip: string): boolean => {
  const cleanZip = zip.trim().split('-')[0].trim();
  return SERVICE_AREA_ZIP_CODES.includes(cleanZip);
};
