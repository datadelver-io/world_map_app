import { REGION_COLORS, PRODUCT_COLORS } from '../constants';
import type { Region, Tab, Product } from '../types';

interface Props {
  tab: Tab;
  product: Product;
}

const SIZE_EXAMPLES = [100, 300, 600, 1000];

function circleRadius(outputKbpd: number): number {
  return Math.round(Math.max(3, Math.sqrt(outputKbpd) * 0.8));
}

const PRODUCT_LABELS: Record<Product, string> = {
  gasoline: 'Gasoline output (est. kb/d)',
  diesel:   'Diesel output (est. kb/d)',
};

const PRODUCT_YIELDS: Record<Product, string> = {
  gasoline: 'Americas ~45%, Europe ~22%, Asia ~28%',
  diesel:   'Americas ~27%, Europe ~43%, Asia ~36%',
};

export function Legend({ tab, product }: Props) {
  const dotColor = tab === 'product' ? PRODUCT_COLORS[product] : undefined;

  return (
    <div className="legend">
      <div className="legend-title">
        {tab === 'region' ? 'Crude Distillation Capacity' : 'Estimated Product Output'}
      </div>

      {tab === 'region' ? (
        <>
          <div className="legend-section-label">By Region</div>
          {(Object.entries(REGION_COLORS) as [Region, string][]).map(([region, color]) => (
            <div key={region} className="legend-row">
              <span className="legend-dot" style={{ background: color }} />
              <span className="legend-text">{region}</span>
            </div>
          ))}
        </>
      ) : (
        <>
          <div className="legend-row" style={{ marginBottom: 8 }}>
            <span className="legend-dot" style={{ background: PRODUCT_COLORS[product] }} />
            <span className="legend-text" style={{ textTransform: 'capitalize' }}>{product}</span>
          </div>
          <div className="legend-source" style={{ marginTop: 0, marginBottom: 8 }}>
            {PRODUCT_YIELDS[product]}
          </div>
        </>
      )}

      <div className="legend-section-label" style={{ marginTop: '10px' }}>
        Circle Size (kb/d)
      </div>
      {SIZE_EXAMPLES.map((cap) => {
        const r = circleRadius(cap);
        const diameter = r * 2;
        return (
          <div key={cap} className="legend-row" style={{ alignItems: 'center' }}>
            <span
              className="legend-circle"
              style={{
                width: diameter,
                height: diameter,
                minWidth: diameter,
                borderRadius: '50%',
                background: dotColor ? `${dotColor}44` : 'rgba(255,255,255,0.25)',
                border: `1px solid ${dotColor ?? 'rgba(255,255,255,0.5)'}`,
                display: 'inline-block',
              }}
            />
            <span className="legend-text" style={{ marginLeft: 8 }}>{cap.toLocaleString()}</span>
          </div>
        );
      })}

      <div className="legend-source">
        {tab === 'product'
          ? 'Yields estimated from EIA/IEA regional averages'
          : 'Sources: Global Energy Monitor, EIA'}
      </div>
    </div>
  );
}
