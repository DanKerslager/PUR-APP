export default function FavoritesMap({ favoritesLocations }) {
  return (
    <div className="card favorites-map">
      <h2>Oblíbené lokace</h2>
      <div className="favorites-map-surface">
        {favoritesLocations.map((loc, i) => {
          const lat = Number(loc?.[0])
          const lon = Number(loc?.[1])
          if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null

          const left = ((lon + 180) / 360) * 100
          const top = ((90 - lat) / 180) * 100

          return (
            <div
              key={i}
              className="fav-location"
              style={{ left: `${left}%`, top: `${top}%` }}
              title={`${lat.toFixed(2)}, ${lon.toFixed(2)}`}
            />
          )
        })}
      </div>
    </div>
  )
}