export default function WeatherView({
  isAuthenticated, user, onLogin, onLogout,
  location, setLocation, output1, weatherIcon, historicalData,
  favorites, showForm, setShowForm, handleFind, handleAddFavorite,
}) {
  return (
    <div className="page">
      <header className="topbar">
        <span className="topbar-title">Počasí</span>
        <div className="topbar-auth">
          {isAuthenticated && user && <span className="user-greeting">Hello, {user.name}</span>}
          {!isAuthenticated && <button className="btn btn-ghost" onClick={() => setShowForm(!showForm)}>Register</button>}
          {!isAuthenticated && <button className="btn btn-primary" onClick={onLogin}>Login</button>}
          {isAuthenticated && <button className="btn btn-ghost" onClick={onLogout}>Logout</button>}
        </div>
      </header>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Register</h2>
            <form className="form" onSubmit={e => e.preventDefault()}>
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" required />
              <label htmlFor="cardNumber">Card Number</label>
              <input type="text" id="cardNumber" name="cardNumber" required />
              <label htmlFor="expiry">Expiry Date</label>
              <input type="text" id="expiry" name="expiry" placeholder="MM/YY" required />
              <label htmlFor="cvs">CVV</label>
              <input type="text" id="cvs" name="cvs" required />
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">Finish Payment</button>
                <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <main className="main">
        <div className="card search-card">
          <div className="search-row">
            <input
              className="search-input"
              type="text"
              id="location"
              name="location"
              placeholder="Enter city..."
              value={location}
              onChange={e => setLocation(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleFind()}
            />
            <button className="btn btn-primary" id="findButton" onClick={handleFind}>Najdi</button>
          </div>

          {isAuthenticated && (
            <div className="favs-row">
              <select className="select" id="dropdown" onChange={e => setLocation(e.target.value)} value="">
                <option value="">Vyber z oblíbených...</option>
                {favorites.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
              <button className="btn btn-outline" id="addFavorite" onClick={handleAddFavorite}>+ Přidat</button>
            </div>
          )}
        </div>

        {(weatherIcon || output1) && (
          <div className="card weather-card">
            {weatherIcon && (
              <img
                className="weather-icon"
                src={`https://openweathermap.org/img/wn/${weatherIcon}@2x.png`}
                alt="weather icon"
              />
            )}
            {output1 && <p className="output">{output1}</p>}
          </div>
        )}

        {historicalData && (
          <div className="card">
            <h2>7-Day History</h2>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Max</th>
                    <th>Min</th>
                    <th>Rain</th>
                    <th>Shower</th>
                    <th>Snow</th>
                  </tr>
                </thead>
                <tbody>
                  {historicalData.map((row, i) => (
                    <tr key={i}>
                      <td>{row.date}</td>
                      <td>{row.maxTemp}°C</td>
                      <td>{row.minTemp}°C</td>
                      <td>{row.rain}mm</td>
                      <td>{row.shower}mm</td>
                      <td>{row.snow}cm</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <footer className="footer">powered by OpenWeather</footer>
    </div>
  )
}
