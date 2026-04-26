import { useAuth0 } from '@auth0/auth0-react'
import { useWeatherApp } from './controller'
import WeatherView from './view'
import './App.css'

export default function App() {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0()
  const weatherApp = useWeatherApp(isAuthenticated, user)

  return (
    <WeatherView
      isAuthenticated={isAuthenticated}
      user={user}
      onLogin={loginWithRedirect}
      onLogout={() => logout({ logoutParams: { returnTo: window.location.origin } })}
      {...weatherApp}
    />
  )
}
