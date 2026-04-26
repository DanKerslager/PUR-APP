import { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import './App.css'

const APPID = '&appid=3034449191d7e019ed5ee40277f84796'
const WEATHER_API = 'https://api.openweathermap.org/data/2.5/weather?'
const GEO_API = 'https://api.openweathermap.org/geo/1.0/direct?q='
const HISTORY_API = 'https://api.open-meteo.com/v1/forecast?'
const HISTORY_API_SET = '&daily=temperature_2m_max,temperature_2m_min,rain_sum,showers_sum,snowfall_sum&timezone=auto&'

const AUTH0_DOMAIN = 'dev-cz1xfrqlz4gbz633.us.auth0.com'
const MANAGE_TOKEN = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkJZWVVLeWtrVkNIbThETGNfUi1fSCJ9.eyJpc3MiOiJodHRwczovL2Rldi1jejF4ZnJxbHo0Z2J6NjMzLnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJISkpTQ2xOZHBPMDV2Uncwb1lYYlNpOWVDdmtLTVVGZEBjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9kZXYtY3oxeGZycWx6NGdiejYzMy51cy5hdXRoMC5jb20vYXBpL3YyLyIsImlhdCI6MTcxNjEzNjQ2MiwiZXhwIjoxNzE2MjIyODYyLCJzY29wZSI6InJlYWQ6dXNlcnMgdXBkYXRlOnVzZXJzIGRlbGV0ZTp1c2VycyBjcmVhdGU6dXNlcnMiLCJndHkiOiJjbGllbnQtY3JlZGVudGlhbHMiLCJhenAiOiJISkpTQ2xOZHBPMDV2Uncwb1lYYlNpOWVDdmtLTVVGZCJ9.LMzUhKlzc54fXRWe-8A01zffUqXMeUH4knyl-AGxPXz01YK4bt_XJEBZxDK0xcgQSSFrBITfObFX3XbowU8UHnJ3wgMuV6DUGjq5VRNYkc-reqau7xg5rM6FBAbZjiQVdezvlUJGPBC8E3vGqyUcQfOjNH2MRUELTG6FGP4dtUn8XgBIpX3y_bFQL9T4jkVnqJJqVhP0JKmc8AKON9TYhp3qlG6NbbRgLRlAxL10e-dRYpL0E3yPU_LIh1Dj6pxhYkrRGj8PsCBV1HoXTZg-FVL1_kkbp7I0kZE4KymdxO9qLBpvR8Ls549GCtBUe9KvAOlyy13QXSGKzdaWWMBYQA'

async function getLocation(location) {
  const res = await fetch(GEO_API + location + '&limit=1' + APPID)
  const data = await res.json()
  return [data[0].lat, data[0].lon]
}

async function getWeather(coords) {
  const res = await fetch(WEATHER_API + 'lat=' + coords[0] + '&lon=' + coords[1] + APPID)
  if (!res.ok) throw new Error('Network response was not ok')
  return res.json()
}

async function fetchHistoricalData(coords) {
  const promises = []
  for (let i = 1; i <= 7; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const d = date.toISOString().split('T')[0]
    const url = `${HISTORY_API}latitude=${coords[0]}&longitude=${coords[1]}${HISTORY_API_SET}start_date=${d}&end_date=${d}`
    promises.push(fetch(url).then(r => r.json()))
  }
  const results = await Promise.all(promises)
  return results.map(data => {
    const { time, temperature_2m_max, temperature_2m_min, rain_sum, showers_sum, snowfall_sum } = data.daily
    return {
      date: time,
      maxTemp: parseInt(temperature_2m_max),
      minTemp: parseInt(temperature_2m_min),
      rain: parseInt(rain_sum),
      shower: parseInt(showers_sum),
      snow: parseInt(snowfall_sum),
    }
  })
}

export default function App() {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0()

  const [location, setLocation] = useState('')
  const [output1, setOutput1] = useState('')
  const [weatherIcon, setWeatherIcon] = useState(null)
  const [historicalData, setHistoricalData] = useState(null)
  const [favorites, setFavorites] = useState([])
  const [metadata, setMetadata] = useState({ favorite_locations: [] })
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (isAuthenticated && user) {
      fetch(`https://${AUTH0_DOMAIN}/api/v2/users/${user.sub}`, {
        headers: { Authorization: `Bearer ${MANAGE_TOKEN}` },
      })
        .then(r => r.json())
        .then(data => {
          const meta = data.user_metadata || {}
          if (!meta.favorite_locations) meta.favorite_locations = []
          setMetadata(meta)
          setFavorites(meta.favorite_locations)
        })
        .catch(console.error)
    }
  }, [isAuthenticated, user])

  const handleFind = async () => {
    setOutput1('You entered: ' + location)
    try {
      const coords = await getLocation(location)
      const weatherData = await getWeather(coords)
      setWeatherIcon(weatherData.weather[0].icon)
      if (isAuthenticated) {
        const hist = await fetchHistoricalData(coords)
        setHistoricalData(hist)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleAddFavorite = async () => {
    const loc = location.trim()
    if (!loc || favorites.includes(loc)) return
    const newFavs = [...favorites, loc]
    const newMeta = { ...metadata, favorite_locations: newFavs }
    setFavorites(newFavs)
    setMetadata(newMeta)
    try {
      await fetch(`https://${AUTH0_DOMAIN}/api/v2/users/${user.sub}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${MANAGE_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_metadata: newMeta }),
      })
    } catch (err) {
      console.error(err)
    }
  }

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
        <button id="login" onClick={() => loginWithRedirect()}>Login</button>
      )}
      {isAuthenticated && (
        <button id="logout" onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
          Logout
        </button>
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
