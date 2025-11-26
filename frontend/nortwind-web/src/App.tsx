import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { getWeatherForecasts, type WeatherForecast } from './api/weather'

function App() {
  const [count, setCount] = useState(0)
  const [forecasts, setForecasts] = useState<WeatherForecast[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchForecasts()
  }, [])

  async function fetchForecasts() {
    setLoading(true)
    setError(null)
    try {
      const data = await getWeatherForecasts()
      setForecasts(data)
    } catch (err: any) {
      setError(err?.message ?? 'Unknown error')
      setForecasts(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>

      <div className="card">
        <button onClick={() => setCount((c) => c + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>

      <section>
        <h2>Weather Forecast</h2>
        <div>
          <button onClick={fetchForecasts} disabled={loading}>
            Refresh
          </button>
        </div>

        {loading && <p>Loading forecasts...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}

        {!loading && !error && forecasts && (
          <ul>
            {forecasts.map((f) => (
              <li key={f.date}>
                <strong>{new Date(f.date).toLocaleDateString()}</strong> — {f.summary ?? 'No summary'} — {f.temperatureC}°C / {f.temperatureF}°F
              </li>
            ))}
          </ul>
        )}

        {!loading && !error && forecasts && forecasts.length === 0 && (
          <p>No forecasts returned.</p>
        )}
      </section>

      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </>
  )
}

export default App
