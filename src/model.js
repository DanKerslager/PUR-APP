const APPID = '&appid=3034449191d7e019ed5ee40277f84796'
const WEATHER_API = 'https://api.openweathermap.org/data/2.5/weather?'
const GEO_API = 'https://api.openweathermap.org/geo/1.0/direct?q='
const HISTORY_API = 'https://api.open-meteo.com/v1/forecast?'
const HISTORY_API_SET = '&daily=temperature_2m_max,temperature_2m_min,rain_sum,showers_sum,snowfall_sum&timezone=auto&'
const AUTH0_PROXY = '/.netlify/functions/auth0-proxy'

export async function getLocation(location) {
  const res = await fetch(GEO_API + location + '&limit=1' + APPID)
  const data = await res.json()
  return [data[0].lat, data[0].lon]
}

export async function getWeather(coords) {
  const res = await fetch(WEATHER_API + 'lat=' + coords[0] + '&lon=' + coords[1] + APPID)
  if (!res.ok) throw new Error('Network response was not ok')
  return res.json()
}

export async function fetchHistoricalData(coords) {
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

export async function loadFavorites(userId) {
  const res = await fetch(AUTH0_PROXY, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, action: 'get' }),
  })
  const data = await res.json()
  const meta = data.user_metadata || {}
  if (!meta.favorite_locations) meta.favorite_locations = []
  return meta
}

export async function saveFavorites(userId, metadata) {
  await fetch(AUTH0_PROXY, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, action: 'patch', data: { user_metadata: metadata } }),
  })
}
