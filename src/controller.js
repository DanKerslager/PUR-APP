import { useState, useEffect } from 'react'
import { getLocation, getWeather, fetchHistoricalData, loadFavorites, saveFavorites } from './model'

export function useWeatherApp(isAuthenticated, user) {
  const [location, setLocation] = useState('')
  const [output1, setOutput1] = useState('')
  const [weatherIcon, setWeatherIcon] = useState(null)
  const [historicalData, setHistoricalData] = useState(null)
  const [favorites, setFavorites] = useState([])
  const [metadata, setMetadata] = useState({ favorite_locations: [] })
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (isAuthenticated && user) {
      loadFavorites(user.sub)
        .then(meta => {
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
      await saveFavorites(user.sub, newMeta)
    } catch (err) {
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
  }
}
