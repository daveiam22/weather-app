'use server'

interface WeatherResponse {
  main: {
    temp: number
  }
  weather: Array<{
    main: string
    description: string
  }>
  name: string
}

export async function getWeather(zipCode: string) {
  if (!process.env.OPENWEATHER_API_KEY) {
    throw new Error('OpenWeather API key is not set')
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?zip=${encodeURIComponent(zipCode)},us&appid=${process.env.OPENWEATHER_API_KEY}&units=imperial`,
      { next: { revalidate: 300 } } // Cache for 5 minutes
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Weather API error (${response.status}): ${errorText}`)
    }

    const data: WeatherResponse = await response.json()

    if (!data.main || !data.weather || data.weather.length === 0) {
      throw new Error('Unexpected API response format')
    }

    return {
      temperature: Math.round(data.main.temp),
      condition: data.weather[0].main.toLowerCase(),
      description: data.weather[0].description,
      cityName: data.name
    }
  } catch (error) {
    console.error('Error fetching weather:', error)
    throw error instanceof Error ? error : new Error('Failed to fetch weather data')
  }
}

