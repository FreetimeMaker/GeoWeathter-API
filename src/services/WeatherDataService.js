const axios = require('axios');

const WeatherDataService = {
  // OpenWeather API Integration
  async getWeatherFromOpenWeather(latitude, longitude, apiKey) {
    try {
      const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
        params: {
          lat: latitude,
          lon: longitude,
          appid: apiKey,
          units: 'metric',
        },
      });

      return {
        temperature: response.data.main.temp,
        humidity: response.data.main.humidity,
        pressure: response.data.main.pressure,
        windSpeed: response.data.wind.speed,
        conditions: response.data.weather[0].main,
        description: response.data.weather[0].description,
      };
    } catch (error) {
      console.error('OpenWeather API Error:', error);
      throw error;
    }
  },

  // WeatherAPI Integration
  async getWeatherFromWeatherAPI(latitude, longitude, apiKey) {
    try {
      const response = await axios.get('https://api.weatherapi.com/v1/current.json', {
        params: {
          q: `${latitude},${longitude}`,
          key: apiKey,
          aqi: 'yes',
        },
      });

      return {
        temperature: response.data.current.temp_c,
        humidity: response.data.current.humidity,
        pressure: response.data.current.pressure_mb,
        windSpeed: response.data.current.wind_kph,
        conditions: response.data.current.condition.text,
        feelsLike: response.data.current.feelslike_c,
        uv: response.data.current.uv,
      };
    } catch (error) {
      console.error('WeatherAPI Error:', error);
      throw error;
    }
  },

  // Aggregiere Daten von mehreren Quellen (Freemium Feature)
  async getAggregatedWeather(latitude, longitude, sources) {
    const results = {};

    for (const source of sources) {
      try {
        if (source === 'openweather') {
          results.openweather = await this.getWeatherFromOpenWeather(
            latitude,
            longitude,
            process.env.OPENWEATHER_API_KEY
          );
        } else if (source === 'weatherapi') {
          results.weatherapi = await this.getWeatherFromWeatherAPI(
            latitude,
            longitude,
            process.env.WEATHER_API_KEY
          );
        }
      } catch (error) {
        console.error(`Error fetching from ${source}:`, error);
      }
    }

    return results;
  },
};

module.exports = WeatherDataService;
