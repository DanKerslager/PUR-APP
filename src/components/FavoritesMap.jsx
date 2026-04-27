export default function FavoritesMap({ favorites = [], favoritesLocations = [], onSelect }) {
  const points = favorites
    .map((name, index) => {
      const loc = favoritesLocations[index]
      const lat = Number(loc?.[0])
      const lon = Number(loc?.[1])
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null
      return { name, lat, lon }
    })
    .filter(Boolean)

  const lats = points.map((p) => p.lat)
  const lons = points.map((p) => p.lon)

  const minLat = lats.length ? Math.min(...lats) : -90
  const maxLat = lats.length ? Math.max(...lats) : 90
  const minLon = lons.length ? Math.min(...lons) : -180
  const maxLon = lons.length ? Math.max(...lons) : 180

  const latSpan = Math.max(maxLat - minLat, 0.8)
  const lonSpan = Math.max(maxLon - minLon, 0.8)
  const latPadding = latSpan * 0.2
  const lonPadding = lonSpan * 0.2

  const viewMinLat = Math.max(-90, minLat - latPadding)
  const viewMaxLat = Math.min(90, maxLat + latPadding)
  const viewMinLon = Math.max(-180, minLon - lonPadding)
  const viewMaxLon = Math.min(180, maxLon + lonPadding)

  const viewLatSpan = Math.max(viewMaxLat - viewMinLat, 1)
  const viewLonSpan = Math.max(viewMaxLon - viewMinLon, 1)

  return (
    <div className="card favorites-map">
      <h2>Oblíbené lokace</h2>
      <div className="favorites-map-surface">
        {points.length === 0 && (
          <p className="favorites-map-empty">Pridej oblibene lokace pro zobrazeni mapy.</p>
        )}

        {points.map((point, i) => {
          const left = ((point.lon - viewMinLon) / viewLonSpan) * 100
          const top = ((viewMaxLat - point.lat) / viewLatSpan) * 100

          return (
            <button
              key={i}
              type="button"
              className="fav-location-btn"
              style={{ left: `${left}%`, top: `${top}%` }}
              title={`${point.name}: ${point.lat.toFixed(2)}, ${point.lon.toFixed(2)}`}
              onClick={() => onSelect?.(point.name)}
            >
              <span className="fav-location" />
              <span className="fav-location-label">{point.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}