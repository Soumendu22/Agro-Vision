export interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  description: string;
  icon: string;
}

export async function getWeatherData(lat: number, lon: number): Promise<WeatherData> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
    if (!apiKey) {
      throw new Error('OpenWeather API key not configured');
    }

    console.log('Fetching weather data for:', { lat, lon, apiKey: apiKey.slice(0, 4) + '...' });

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Weather API error response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`Weather API error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Weather data received:', data);

    if (!data.main || !data.weather?.[0]) {
      console.error('Invalid weather data format:', data);
      throw new Error('Invalid weather data format');
    }

    return {
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    if (error instanceof Error) {
      throw new Error(`Weather API error: ${error.message}`);
    }
    throw error;
  }
} 