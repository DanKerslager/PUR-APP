export default function HistoricalTable({ data }) {
  if (!data) return null
  return (
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
            {data.map((row, i) => (
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
  )
}
