export default function FavoritesBar({ favorites, favoritesLocations }) {
  return (
    <div className="favorites-map">
      {favoritesLocations.map((loc, i) => (
        <div key={i} className="fav-location" style={{ left: `${loc[1] + 180}%`, top: `${90 - (loc[0] + 90)}%` }} />
      ))}
    </div>
    )
}