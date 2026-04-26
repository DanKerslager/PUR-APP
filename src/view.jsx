export default function WeatherView({
  isAuthenticated, user, onLogin, onLogout,
  location, setLocation, output1, weatherIcon, historicalData,
  favorites, showForm, setShowForm, handleFind, handleAddFavorite,
}) {
  return (
    <div className="container">
      {!isAuthenticated && (
        <button id="registerBtn" onClick={() => setShowForm(!showForm)}>Register</button>
      )}

      {showForm && (
        <div id="registrationForm">
          <form id="paymentForm" onSubmit={e => e.preventDefault()}>
            <label htmlFor="email">Email:</label><br />
            <input type="email" id="email" name="email" required /><br /><br />
            <label htmlFor="cardNumber">Card Number:</label><br />
            <input type="text" id="cardNumber" name="cardNumber" required /><br /><br />
            <label htmlFor="expiry">Expiry Date:</label><br />
            <input type="text" id="expiry" name="expiry" placeholder="MM/YY" required /><br /><br />
            <label htmlFor="cvs">CVS:</label><br />
            <input type="text" id="cvs" name="cvs" required /><br /><br />
            <button type="submit">Finish Payment</button>
          </form>
          <button onClick={() => setShowForm(false)}>Cancel</button>
        </div>
      )}

      {!isAuthenticated && (
        <button id="login" onClick={onLogin}>Login</button>
      )}
      {isAuthenticated && (
        <button id="logout" onClick={onLogout}>Logout</button>
      )}
      {isAuthenticated && user && <div id="user">Hello, {user.name}</div>}

      <h1>Počasí</h1>
      <label htmlFor="location">Lokace:</label>
      <input
        type="text"
        id="location"
        name="location"
        value={location}
        onChange={e => setLocation(e.target.value)}
      /><br /><br />
      <button type="button" id="findButton" onClick={handleFind}>Najdi</button>

      {isAuthenticated && (
        <div id="favs">
          <select id="dropdown" onChange={e => setLocation(e.target.value)} value="">
            <option value="">Vyber z oblíbených</option>
            {favorites.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
      )}

      {isAuthenticated && (
        <button type="button" id="addFavorite" onClick={handleAddFavorite}>
          Přidat do oblíbených
        </button>
      )}

      <div id="output1">{output1}</div>
      <div id="output2"></div>

      <div id="imgContainer">
        {weatherIcon && (
          <img src={`https://openweathermap.org/img/wn/${weatherIcon}@2x.png`} alt="weather icon" />
        )}
      </div>

      <div id="historical">
        {historicalData && (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Max Temp</th>
                <th>Min Temp</th>
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
        )}
      </div>

      <footer>
        <p>powered by OpenWeather</p>
      </footer>
    </div>
  )
}
