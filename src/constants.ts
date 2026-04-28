import type { Region } from './types';

export const REGION_COLORS: Record<Region, string> = {
  'Americas':    '#60a5fa',
  'Europe':      '#4ade80',
  'Middle East': '#fbbf24',
  'Asia-Pacific':'#f87171',
  'Africa':      '#c084fc',
  'Russia/CIS':  '#fb923c',
};

export const PRODUCT_COLORS: Record<'gasoline' | 'diesel', string> = {
  gasoline: '#f59e0b',
  diesel:   '#38bdf8',
};

export const ALL_REGIONS: Region[] = [
  'Asia-Pacific',
  'Middle East',
  'Americas',
  'Europe',
  'Russia/CIS',
  'Africa',
];
