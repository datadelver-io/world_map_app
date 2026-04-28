import type { Region } from '../types';

// Region-typical product yield fractions (% of crude throughput).
// Based on EIA refinery yield data and IEA regional refinery configuration reports.
const GASOLINE_PCT: Record<Region, number> = {
  'Americas':    0.45,
  'Europe':      0.22,
  'Middle East': 0.18,
  'Asia-Pacific':0.28,
  'Russia/CIS':  0.17,
  'Africa':      0.22,
};

const DIESEL_PCT: Record<Region, number> = {
  'Americas':    0.27,
  'Europe':      0.43,
  'Middle East': 0.34,
  'Asia-Pacific':0.36,
  'Russia/CIS':  0.38,
  'Africa':      0.30,
};

export function productOutput(capacity: number, region: Region, product: 'gasoline' | 'diesel'): number {
  const pct = product === 'gasoline' ? GASOLINE_PCT[region] : DIESEL_PCT[region];
  return capacity * pct;
}

export function gasolinePct(region: Region): number { return GASOLINE_PCT[region]; }
export function dieselPct(region: Region): number   { return DIESEL_PCT[region]; }
