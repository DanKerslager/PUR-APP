import Topbar from './components/Topbar'
import RegisterModal from './components/RegisterModal'
import SearchBar from './components/SearchBar'
import FavoritesBar from './components/FavoritesBar'
import FavoritesMap from './components/FavoritesMap'
import WeatherResult from './components/WeatherResult'
import HistoricalTable from './components/HistoricalTable'

export default function WeatherView({
  isAuthenticated, user, onLogin, onLogout,
  location, setLocation, output1, weatherIcon, historicalData,
  favorites, favoritesLocations, showForm, setShowForm, handleFind, handleAddFavorite,
}) {
  return (
    <div className="page">
      <Topbar
        isAuthenticated={isAuthenticated}
        user={user}
        onLogin={onLogin}
        onLogout={onLogout}
        onRegister={() => setShowForm(true)}
      />

      {showForm && <RegisterModal onClose={() => setShowForm(false)} />}

      <main className="main">
        <SearchBar
          location={location}
          onChange={setLocation}
          onFind={handleFind}
        />

        {isAuthenticated && (
          <FavoritesBar
            favorites={favorites}
            onSelect={setLocation}
            onAdd={handleAddFavorite}
          />
        )}

        {isAuthenticated && (
          <FavoritesMap
            favorites={favorites}
            favoritesLocations={favoritesLocations}
            onSelect={setLocation}
          />
        )}

        <WeatherResult icon={weatherIcon} output={output1} />

        {isAuthenticated && <HistoricalTable data={historicalData} />}
      </main>

      <footer className="footer">powered by OpenWeather</footer>
    </div>
  )
}
