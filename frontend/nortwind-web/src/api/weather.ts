export interface WeatherForecast {
  date: string
  temperatureC: number
  temperatureF: number
  summary?: string
}

const BASE = 'https://localhost:7035'

export async function getWeatherForecasts(): Promise<WeatherForecast[]> {
  const res = await fetch(`${BASE}/WeatherForecast`, {
    headers: { 'Accept': 'application/json' },
  })
  if (!res.ok) {
    throw new Error(`Weather API error: ${res.status} ${res.statusText}`)
  }
  const data = (await res.json()) as WeatherForecast[]
  return data
}

