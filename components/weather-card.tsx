'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Sun, Cloud, CloudRain, CloudFog, Snowflake, Loader } from 'lucide-react'
import { getWeather } from '@/app/actions/weather'

interface WeatherData {
  temperature: number
  condition: string
  description: string
  cityName: string
}

export default function WeatherCard({ zipCode }: { zipCode: string }) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getWeather(zipCode)
        setWeather(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
        setWeather(null)
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
    // Refresh weather data every 5 minutes
    const interval = setInterval(fetchWeather, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [zipCode])

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return <Sun className="h-12 w-12 text-yellow-400" />
      case 'clouds':
        return <Cloud className="h-12 w-12 text-gray-400" />
      case 'rain':
      case 'drizzle':
        return <CloudRain className="h-12 w-12 text-blue-400" />
      case 'snow':
        return <Snowflake className="h-12 w-12 text-blue-200" />
      case 'mist':
      case 'fog':
        return <CloudFog className="h-12 w-12 text-gray-400" />
      default:
        return <Cloud className="h-12 w-12 text-gray-400" />
    }
  }

  const getWeatherSummary = (condition: string, temperature: number) => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return temperature > 77 ? "It's a hot, sunny day!" : "Enjoy the sunshine!"
      case 'clouds':
        return "Pray you see the sun again."
      case 'rain':
      case 'drizzle':
        return "Don't forget your umbrella!"
      case 'snow':
        return "Bundle up, it's snowing!"
      case 'mist':
      case 'fog':
        return "Drive and walk carefully, visibility is reduced."
      default:
        return "Check the forecast for details."
    }
  }

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-6">
        <h2 className="text-2xl font-semibold mb-4">{weather?.cityName || zipCode}</h2>
        {loading ? (
          <div className="flex justify-center">
            <Loader className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : error ? (
          <p className="text-red-500 text-sm">{error}</p>
        ) : weather ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-4xl font-bold">{weather.temperature}°F</div>
              {getWeatherIcon(weather.condition)}
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground capitalize">
                {weather.description}
              </p>
              <p className="text-sm text-muted-foreground" aria-live="polite">
                {getWeatherSummary(weather.condition, weather.temperature)}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No weather data available. Try again.</p>
        )}
      </CardContent>
    </Card>
  )
}

