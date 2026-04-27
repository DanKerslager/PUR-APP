import { useState, useEffect } from 'react'
import { getLocation, getWeather, fetchHistoricalData, loadFavorites, saveFavorites } from './model'

export function useWeatherApp(isAuthenticated, user) {
  const [location, setLocation] = useState(() => localStorage.getItem('lastLocation') || '')
  const [output1, setOutput1] = useState('')
  const [weatherIcon, setWeatherIcon] = useState(null)
  const [historicalData, setHistoricalData] = useState(null)
  const [favorites, setFavorites] = useState([])
  const [favoritesLocations, setFavoritesLocations] = useState([])
  const [metadata, setMetadata] = useState({ favorite_locations: [] })
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (isAuthenticated && user) {
      loadFavorites(user.sub)
        .then(async (meta) => {
          const settled = await Promise.allSettled(
            meta.favorite_locations.map(async (fav) => {
              const coords = await getLocation(fav)
              return { fav, coords }
            })
          )

          const valid = settled
            .filter((entry) => entry.status === 'fulfilled')
            .map((entry) => entry.value)

          const validFavorites = valid.map((entry) => entry.fav)
          const validCoords = valid.map((entry) => entry.coords)

          setMetadata({ ...meta, favorite_locations: validFavorites })
          setFavorites(validFavorites)
          setFavoritesLocations(validCoords)
        })
        .catch(console.error)
    }
  }, [isAuthenticated, user])

  const handleFind = async () => {
    const loc = location.trim()
    if (!loc) return

    try {
      const coords = await getLocation(loc)
      const weatherData = await getWeather(coords)
      localStorage.setItem('lastLocation', loc)
      setOutput1('You entered: ' + loc)
      setWeatherIcon(weatherData.weather[0].icon)
      if (isAuthenticated) {
        fetchHistoricalData(coords)
          .then((hist) => setHistoricalData(hist))
          .catch((historyError) => {
            setHistoricalData([])
            console.error(historyError)
          })
      }
    } catch (err) {
      setOutput1('Location not found')
      setHistoricalData(null)
      console.error(err)
    }
  }

  const handleAddFavorite = async () => {
    const loc = location.trim()
    if (!loc || favorites.includes(loc)) return

    try {
      const coords = await getLocation(loc)
      const newFavs = [...favorites, loc]
      const newMeta = { ...metadata, favorite_locations: newFavs }

      setFavorites(newFavs)
      setFavoritesLocations((prev) => [...prev, coords])
      setMetadata(newMeta)
      await saveFavorites(user.sub, newMeta)
    } catch (err) {
      setOutput1('Location not found')
      console.error(err)
    }
  }

  return {
    location, setLocation,
    output1,
    weatherIcon,
    historicalData,
    favorites,
    showForm, setShowForm,
    handleFind,
    handleAddFavorite,
    favoritesLocations,
  }
}
