import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import type { Refinery, Region, Tab, Product, OilWell } from '../types';
import { REGION_COLORS, PRODUCT_COLORS } from '../constants';
import { productOutput, gasolinePct, dieselPct } from '../utils/yields';

interface Props {
  refineries: Refinery[];
  activeRegions: Set<Region>;
  minCapacity: number;
  tab: Tab;
  product: Product;
  wells: OilWell[];
  showWells: boolean;
  wellYear: number;
}

function markerRadius(outputKbpd: number): number {
  return Math.max(3, Math.sqrt(outputKbpd) * 0.8);
}

export function WorldMap({ refineries, activeRegions, minCapacity, tab, product, wells, showWells, wellYear }: Props) {
  const visibleRefineries = refineries.filter(
    (r) => activeRegions.has(r.region) && r.capacity_kbpd >= minCapacity
  );

  const visibleWells = showWells
    ? wells.filter((w) => w.start_year <= wellYear && (w.end_year === null || w.end_year >= wellYear))
    : [];

  return (
    <MapContainer
      center={[20, 10]}
      zoom={2}
      minZoom={2}
      style={{ height: '100%', width: '100%' }}
      worldCopyJump={false}
    >
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        attribution='Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics'
        maxZoom={19}
      />

      {visibleWells.map((w) => (
        <CircleMarker
          key={w.id}
          center={[w.lat, w.lon]}
          radius={4}
          pathOptions={{
            fillColor: '#fde68a',
            fillOpacity: 0.9,
            color: '#92400e',
            weight: 1,
            opacity: 1,
          }}
        >
          <Popup>
            <div className="popup-content">
              <div className="popup-name">{w.name}</div>
              <div className="popup-operator">{w.country}</div>
              <table className="popup-table">
                <tbody>
                  <tr>
                    <td>First production</td>
                    <td>{w.start_year}</td>
                  </tr>
                  <tr>
                    <td>Status</td>
                    <td>{w.end_year === null ? 'Active' : `Shut in ${w.end_year}`}</td>
                  </tr>
                  <tr>
                    <td>Production</td>
                    <td><strong>{w.production_kbpd.toLocaleString()} kb/d</strong></td>
                  </tr>
                  <tr>
                    <td>Annual</td>
                    <td>{Math.round(w.production_kbpd * 365 / 1000).toLocaleString()} mb/yr</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Popup>
        </CircleMarker>
      ))}

      {visibleRefineries.map((r) => {
        const output = tab === 'product'
          ? productOutput(r.capacity_kbpd, r.region, product)
          : r.capacity_kbpd;
        const color = tab === 'product'
          ? PRODUCT_COLORS[product]
          : REGION_COLORS[r.region];

        const gasolineKbpd = Math.round(r.capacity_kbpd * gasolinePct(r.region));
        const dieselKbpd   = Math.round(r.capacity_kbpd * dieselPct(r.region));

        return (
          <CircleMarker
            key={`${r.id}-${tab}-${product}`}
            center={[r.lat, r.lon]}
            radius={markerRadius(output)}
            pathOptions={{
              fillColor: color,
              fillOpacity: 1,
              color,
              weight: 1,
              opacity: 1,
            }}
          >
            <Popup>
              <div className="popup-content">
                <div className="popup-name">{r.name}</div>
                <div className="popup-operator">{r.operator}</div>
                <table className="popup-table">
                  <tbody>
                    <tr>
                      <td>Country</td>
                      <td>{r.country}</td>
                    </tr>
                    <tr>
                      <td>Region</td>
                      <td>{r.region}</td>
                    </tr>
                    <tr>
                      <td>Capacity</td>
                      <td><strong>{r.capacity_kbpd.toLocaleString()} kb/d</strong></td>
                    </tr>
                    <tr>
                      <td>Gasoline est.</td>
                      <td>{gasolineKbpd.toLocaleString()} kb/d</td>
                    </tr>
                    <tr>
                      <td>Diesel est.</td>
                      <td>{dieselKbpd.toLocaleString()} kb/d</td>
                    </tr>
                    <tr>
                      <td>Annual</td>
                      <td>{Math.round(r.capacity_kbpd * 365 / 1000).toLocaleString()} mb/yr</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
