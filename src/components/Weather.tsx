"use client";

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Thermometer, Droplets, Sun, Cloud, CloudRain } from 'lucide-react';
import { getWeatherData, WeatherData } from '@/lib/weather';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

interface WeatherProps {
  lat: number;
  lon: number;
}

const getWeatherIcon = (description: string) => {
  const desc = description.toLowerCase();
  if (desc.includes('rain') || desc.includes('drizzle')) return <CloudRain className="h-8 w-8 text-blue-400" />;
  if (desc.includes('cloud')) return <Cloud className="h-8 w-8 text-gray-400" />;
  return <Sun className="h-8 w-8 text-yellow-400" />;
};

export function Weather({ lat, lon }: WeatherProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY) {
        setError('Weather API key not configured');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getWeatherData(lat, lon);
        setWeather(data);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load weather data';
        setError(errorMessage);
        console.error('Weather fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    // Refresh weather data every 5 minutes
    const interval = setInterval(fetchWeather, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [lat, lon]);

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-neutral-800 to-neutral-900 border-none p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-neutral-700 rounded-full w-1/3" />
          <div className="h-16 bg-neutral-700 rounded-lg" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-12 bg-neutral-700 rounded-lg" />
            <div className="h-12 bg-neutral-700 rounded-lg" />
          </div>
        </div>
      </Card>
    );
  }

  if (error || !weather) {
    return (
      <Card className="bg-gradient-to-br from-red-900/50 to-neutral-900 border-none p-6">
        <div className="flex items-center gap-3 text-red-400">
          <CloudRain className="h-6 w-6" />
          <p className="font-medium">{error || 'Failed to load weather data'}</p>
        </div>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gradient-to-br from-neutral-800 to-neutral-900 border-none overflow-hidden">
        <div className="relative p-6">
          {/* Background Weather Icon */}
          <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
            {getWeatherIcon(weather.description)}
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Temperature Section */}
            <div className="flex items-center gap-4">
              {getWeatherIcon(weather.description)}
              <div>
                <p className="text-4xl font-bold text-white">
                  {weather.temperature}°C
                </p>
                <p className="text-neutral-400 capitalize">
                  {weather.description}
                </p>
              </div>
            </div>

            {/* Weather Details */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-700">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Droplets className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-neutral-400">Humidity</p>
                  <p className="text-lg font-semibold text-white">
                    {weather.humidity}%
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-500/10">
                  <Thermometer className="h-5 w-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-neutral-400">Feels like</p>
                  <p className="text-lg font-semibold text-white">
                    {weather.feelsLike}°C
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
} 