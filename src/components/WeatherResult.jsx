export default function WeatherResult({ icon, output }) {
  if (!icon && !output) return null
  return (
    <div className="card weather-card">
      {icon && (
        <img
          className="weather-icon"
          src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
          alt="weather icon"
        />
      )}
      {output && <p className="output">{output}</p>}
    </div>
  )
}
