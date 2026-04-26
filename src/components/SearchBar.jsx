export default function SearchBar({ location, onChange, onFind }) {
  return (
    <div className="card search-card">
      <div className="search-row">
        <input
          className="search-input"
          type="text"
          id="location"
          name="location"
          placeholder="Enter city..."
          value={location}
          onChange={e => onChange(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onFind()}
        />
        <button className="btn btn-primary" onClick={onFind}>Najdi</button>
      </div>
    </div>
  )
}
