const APPID = '&appid=3034449191d7e019ed5ee40277f84796'
const WEATHER_API = 'https://api.openweathermap.org/data/2.5/weather?'
const GEO_API = 'https://api.openweathermap.org/geo/1.0/direct?q='
const HISTORY_API = 'https://api.open-meteo.com/v1/forecast?'
const HISTORY_API_SET = '&daily=temperature_2m_max,temperature_2m_min,rain_sum,showers_sum,snowfall_sum&timezone=auto&'
const AUTH0_PROXY = '/.netlify/functions/auth0-proxy'

export async function getLocation(location) {
  const res = await fetch(GEO_API + location + '&limit=1' + APPID)
  if (!res.ok) throw new Error('Failed to resolve location')
  const data = await res.json()
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Location not found')
  }
  return [data[0].lat, data[0].lon]
}

export async function getWeather(coords) {
  const res = await fetch(WEATHER_API + 'lat=' + coords[0] + '&lon=' + coords[1] + APPID)
  if (!res.ok) throw new Error('Network response was not ok')
  return res.json()
}

export async function fetchHistoricalData(coords) {
  const requests = []
  for (let i = 1; i <= 7; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const d = date.toISOString().split('T')[0]
    const url = `${HISTORY_API}latitude=${coords[0]}&longitude=${coords[1]}${HISTORY_API_SET}start_date=${d}&end_date=${d}`
    requests.push({
      date: d,
      promise: fetch(url)
        .then(r => (r.ok ? r.json() : null))
        .catch(() => null),
    })
  }
  const results = await Promise.all(requests.map((req) => req.promise))
  return results
    .map((data, index) => {
      if (!data || !data.daily) return null
      const { time, temperature_2m_max, temperature_2m_min, rain_sum, showers_sum, snowfall_sum } = data.daily
      if (!time || !temperature_2m_max || !temperature_2m_min) return null

      const fallbackDate = requests[index].date
      return {
        date: time[0] || fallbackDate,
        maxTemp: Number(temperature_2m_max[0] ?? 0),
        minTemp: Number(temperature_2m_min[0] ?? 0),
        rain: Number(rain_sum?.[0] ?? 0),
        shower: Number(showers_sum?.[0] ?? 0),
        snow: Number(snowfall_sum?.[0] ?? 0),
      }
    })
    .filter(Boolean)
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
