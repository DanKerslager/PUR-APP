export default function FavoritesBar({ favorites, onSelect, onAdd }) {
  return (
    <div className="card">
      <div className="favs-row">
        <select className="select" onChange={e => onSelect(e.target.value)} value="">
          <option value="">Vyber z oblíbených...</option>
          {favorites.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
        <button className="btn btn-outline" onClick={onAdd}>+ Přidat</button>
      </div>
    </div>
  )
}
