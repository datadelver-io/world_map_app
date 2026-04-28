export type Region =
  | 'Americas'
  | 'Europe'
  | 'Middle East'
  | 'Asia-Pacific'
  | 'Africa'
  | 'Russia/CIS';

export type Tab = 'region' | 'product';
export type Product = 'gasoline' | 'diesel';

export interface OilWell {
  id: number;
  name: string;
  country: string;
  lat: number;
  lon: number;
  start_year: number;
  end_year: number | null; // null = still active
  production_kbpd: number; // typical/peak production in thousand barrels per day
}

export interface Refinery {
  id: number;
  name: string;
  operator: string;
  country: string;
  region: Region;
  lat: number;
  lon: number;
  capacity_kbpd: number; // thousand barrels per day
}
