import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// Weather graphic components
const WeatherGraphic = ({ condition }) => {
  // Map weather conditions to appropriate graphic styles
  const getGraphicStyle = (condition) => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('rain')) {
      return {
        skyColor: '#5D9EA6',
        sunOpacity: 0.5,
        cloudOpacity: 0.8,
        rainOpacity: 1
      };
    }
    if (lowerCondition.includes('cloud')) {
      return {
        skyColor: '#A9A9A9',
        sunOpacity: 0.3,
        cloudOpacity: 0.9,
        rainOpacity: 0
      };
    }
    if (lowerCondition.includes('clear') || lowerCondition.includes('sun')) {
      return {
        skyColor: '#87CEEB',
        sunOpacity: 1,
        cloudOpacity: 0.2,
        rainOpacity: 0
      };
    }
    // Default to partly cloudy
    return {
      skyColor: '#B0C4DE',
      sunOpacity: 0.7,
      cloudOpacity: 0.6,
      rainOpacity: 0
    };
  };

  const style = getGraphicStyle(condition);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="w-full h-48">
      {/* Sky background */}
      <rect width="200" height="200" fill={style.skyColor}/>
      
      {/* Sun */}
      <circle cx="100" cy="60" r="30" fill="#FFD700" opacity={style.sunOpacity}/>
      
      {/* Clouds */}
      <path d="M40,100 Q70,80 100,100 Q130,120 160,100" 
            fill="#FFFFFF" opacity={style.cloudOpacity}/>
      
      {/* Rain drops - conditional rendering */}
      {style.rainOpacity > 0 && (
        <path d="M70,140 L60,160 M90,140 L80,160 M110,140 L100,160 
                 M130,140 L120,160" 
              stroke="#4169E1" strokeWidth="2" opacity={style.rainOpacity}/>
      )}
      
      {/* Ground/Hill */}
      <path d="M0,180 Q100,150 200,180 L200,200 L0,200 Z" 
            fill="#90EE90"/>
    </svg>
  );
};
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Cloud, 
  Droplet, 
  ThermometerSun, 
  Wind, 
  Thermometer 
} from 'lucide-react';

// Note: You'll need to replace this with a valid OpenWeatherMap API key
const API_KEY = 'af1dec271753272fbf9e6bc2a205d152';

const WeatherApp = () => {
  const [cities, setCities] = useState(['New York', 'London', 'Tokyo']);
  const [weatherData, setWeatherData] = useState({});
  const [newCity, setNewCity] = useState('');

  // Fetch weather data for all cities
  const fetchWeatherData = async (cityName) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error('City not found');
      }
      
      const data = await response.json();
      return {
        name: data.name,
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed),
        icon: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
      };
    } catch (error) {
      console.error(`Error fetching weather for ${cityName}:`, error);
      return null;
    }
  };

  // Load weather data for all cities
  useEffect(() => {
    const loadWeatherData = async () => {
      const weatherPromises = cities.map(city => fetchWeatherData(city));
      const results = await Promise.all(weatherPromises);
      
      const weatherDataObject = {};
      cities.forEach((city, index) => {
        if (results[index]) {
          weatherDataObject[city] = results[index];
        }
      });
      
      setWeatherData(weatherDataObject);
    };

    loadWeatherData();
    const intervalId = setInterval(loadWeatherData, 10 * 60 * 1000); // Refresh every 10 minutes

    return () => clearInterval(intervalId);
  }, [cities]);

  // Add a new city
  const handleAddCity = async () => {
    if (newCity && !cities.includes(newCity) && cities.length < 5) {
      const cityWeather = await fetchWeatherData(newCity);
      
      if (cityWeather) {
        setCities([...cities, newCity]);
        setWeatherData(prev => ({
          ...prev,
          [newCity]: cityWeather
        }));
        setNewCity('');
      } else {
        alert('Could not find weather data for this city');
      }
    }
  };

  // Remove a city
  const handleRemoveCity = (cityToRemove) => {
    setCities(cities.filter(city => city !== cityToRemove));
    const { [cityToRemove]: removedCity, ...remainingWeather } = weatherData;
    setWeatherData(remainingWeather);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-6">Weather Tracker</h1>
      
      {/* City Input */}
      <div className="flex mb-6">
        <Input 
          type="text"
          placeholder="Add a city"
          value={newCity}
          onChange={(e) => setNewCity(e.target.value)}
          className="mr-2 flex-grow"
        />
        <Button onClick={handleAddCity} disabled={cities.length >= 5}>
          Add City
        </Button>
      </div>

      {/* Weather Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {cities.map(city => (
          <Card key={city} className="relative">
            <Button 
              variant="destructive" 
              size="sm" 
              className="absolute top-2 right-2 z-10"
              onClick={() => handleRemoveCity(city)}
            >
              Remove
            </Button>
            {weatherData[city] ? (
              <>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {city}
                    <img 
                      src={weatherData[city].icon} 
                      alt="Weather icon" 
                      className="w-16 h-16"
                    />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Thermometer className="mr-2" />
                      <span>Temperature: {weatherData[city].temperature}°C</span>
                    </div>
                    <div className="flex items-center">
                      <ThermometerSun className="mr-2" />
                      <span>Feels Like: {weatherData[city].feelsLike}°C</span>
                    </div>
                    <div className="flex items-center">
                      <Cloud className="mr-2" />
                      <span>Condition: {weatherData[city].description}</span>
                    </div>
                    <div className="flex items-center">
                      <Droplet className="mr-2" />
                      <span>Humidity: {weatherData[city].humidity}%</span>
                    </div>
                    <div className="flex items-center">
                      <Wind className="mr-2" />
                      <span>Wind Speed: {weatherData[city].windSpeed} m/s</span>
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent>Loading weather data...</CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WeatherApp;
