import { useState, useMemo } from 'react';
import { WorldMap } from './components/WorldMap';
import { Legend } from './components/Legend';
import { refineries } from './data/refineries';
import { oilWells } from './data/wells';
import { REGION_COLORS, PRODUCT_COLORS, ALL_REGIONS } from './constants';
import { productOutput } from './utils/yields';
import type { Region, Tab, Product } from './types';

const WELL_YEAR_MIN = 1960;
const WELL_YEAR_MAX = 2026;

const MAX_CAPACITY = Math.max(...refineries.map((r) => r.capacity_kbpd));

export default function App() {
  const [tab, setTab] = useState<Tab>('region');
  const [product, setProduct] = useState<Product>('gasoline');
  const [activeRegions, setActiveRegions] = useState<Set<Region>>(new Set(ALL_REGIONS));
  const [minCapacity, setMinCapacity] = useState(0);
  const [search, setSearch] = useState('');
  const [showWells, setShowWells] = useState(false);
  const [wellYear, setWellYear] = useState(WELL_YEAR_MAX);

  const filteredRefineries = useMemo(() => {
    const q = search.toLowerCase();
    return refineries.filter(
      (r) =>
        activeRegions.has(r.region) &&
        r.capacity_kbpd >= minCapacity &&
        (q === '' ||
          r.name.toLowerCase().includes(q) ||
          r.country.toLowerCase().includes(q) ||
          r.operator.toLowerCase().includes(q))
    );
  }, [activeRegions, minCapacity, search]);

  function toggleRegion(region: Region) {
    setActiveRegions((prev) => {
      const next = new Set(prev);
      if (next.has(region)) next.delete(region);
      else next.add(region);
      return next;
    });
  }

  const totalCapacity = filteredRefineries.reduce((sum, r) => sum + r.capacity_kbpd, 0);
  const totalProduct  = filteredRefineries.reduce(
    (sum, r) => sum + productOutput(r.capacity_kbpd, r.region, product),
    0
  );

  return (
    <div className="app">
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-title">World Petroleum<br />Refinery Map</div>
          <div className="sidebar-subtitle">Crude distillation capacity</div>
        </div>

        <div className="tab-bar">
          <button
            className={`tab-btn ${tab === 'region' ? 'tab-btn--active' : ''}`}
            onClick={() => setTab('region')}
          >
            By Region
          </button>
          <button
            className={`tab-btn ${tab === 'product' ? 'tab-btn--active' : ''}`}
            onClick={() => setTab('product')}
          >
            By Product
          </button>
        </div>

        <div className="sidebar-section">
          <input
            className="search-input"
            type="text"
            placeholder="Search refinery, country, operator…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {tab === 'region' ? (
          <div className="sidebar-section">
            <div className="section-label">Region</div>
            {ALL_REGIONS.map((region) => {
              const active = activeRegions.has(region);
              return (
                <label key={region} className="region-row">
                  <span
                    className="region-dot"
                    style={{
                      background: active ? REGION_COLORS[region] : 'transparent',
                      borderColor: REGION_COLORS[region],
                    }}
                  />
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => toggleRegion(region)}
                    style={{ display: 'none' }}
                  />
                  <span className={`region-label ${active ? '' : 'region-label--dim'}`}>{region}</span>
                </label>
              );
            })}
          </div>
        ) : (
          <div className="sidebar-section">
            <div className="section-label">Product</div>
            <div className="product-toggle">
              {(['gasoline', 'diesel'] as Product[]).map((p) => (
                <button
                  key={p}
                  className={`product-btn ${product === p ? 'product-btn--active' : ''}`}
                  style={product === p ? { borderColor: PRODUCT_COLORS[p], color: PRODUCT_COLORS[p] } : {}}
                  onClick={() => setProduct(p)}
                >
                  <span
                    className="product-btn-dot"
                    style={{ background: product === p ? PRODUCT_COLORS[p] : 'transparent', borderColor: PRODUCT_COLORS[p] }}
                  />
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
            <div className="product-note">
              Dot size = estimated {product} output (kb/d)
            </div>
          </div>
        )}

        <div className="sidebar-section">
          <label className="wells-toggle">
            <input
              type="checkbox"
              checked={showWells}
              onChange={(e) => setShowWells(e.target.checked)}
              className="wells-checkbox"
            />
            <span className="wells-dot" />
            <span className="section-label" style={{ margin: 0 }}>Oil wells layer</span>
          </label>
          {showWells && (
            <div className="wells-year-control">
              <div className="wells-year-label">
                Active in <strong>{wellYear}</strong>
              </div>
              <input
                type="range"
                min={WELL_YEAR_MIN}
                max={WELL_YEAR_MAX}
                step={1}
                value={wellYear}
                onChange={(e) => setWellYear(Number(e.target.value))}
                className="capacity-slider"
              />
              <div className="slider-labels">
                <span>{WELL_YEAR_MIN}</span>
                <span>{WELL_YEAR_MAX}</span>
              </div>
            </div>
          )}
        </div>

        <div className="sidebar-section">
          <div className="section-label">
            Min capacity: <strong>{minCapacity.toLocaleString()} kb/d</strong>
          </div>
          <input
            type="range"
            min={0}
            max={MAX_CAPACITY}
            step={10}
            value={minCapacity}
            onChange={(e) => setMinCapacity(Number(e.target.value))}
            className="capacity-slider"
          />
          <div className="slider-labels">
            <span>0</span>
            <span>{MAX_CAPACITY.toLocaleString()}</span>
          </div>
        </div>

        <div className="sidebar-stats">
          <div className="stat">
            <span className="stat-value">{filteredRefineries.length}</span>
            <span className="stat-label">refineries</span>
          </div>
          <div className="stat">
            {tab === 'region' ? (
              <>
                <span className="stat-value">{(totalCapacity / 1000).toFixed(1)}M</span>
                <span className="stat-label">kb/d total</span>
              </>
            ) : (
              <>
                <span className="stat-value">{(totalProduct / 1000).toFixed(1)}M</span>
                <span className="stat-label">kb/d {product}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="map-wrapper">
        <WorldMap
          refineries={refineries}
          activeRegions={activeRegions}
          minCapacity={minCapacity}
          tab={tab}
          product={product}
          wells={oilWells}
          showWells={showWells}
          wellYear={wellYear}
        />
        <div className="legend-overlay">
          <Legend tab={tab} product={product} />
        </div>
      </div>
    </div>
  );
}
