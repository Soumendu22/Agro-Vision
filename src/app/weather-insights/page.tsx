"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Thermometer, Droplets, Wind, Sun, Cloud, CloudRain, ArrowLeft } from "lucide-react";
import { format, startOfDay } from "date-fns";
import { Button } from "@/components/ui/button";

interface WeatherData {
  date: Date;
  temperature: number;
  humidity: number;
  description: string;
  icon: string;
  feelsLike: number;
  windSpeed: number;
}

interface WeatherItem {
  dt: number;
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
  };
  wind: {
    speed: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
}

interface User {
  farmDetails?: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

const getWeatherIcon = (description: string) => {
  const desc = description.toLowerCase();
  if (desc.includes('rain') || desc.includes('drizzle')) return <CloudRain className="h-8 w-8 text-blue-400" />;
  if (desc.includes('cloud')) return <Cloud className="h-8 w-8 text-gray-400" />;
  return <Sun className="h-8 w-8 text-yellow-400" />;
};

export default function WeatherInsightsPage() {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/');
      return;
    }
    const userData = JSON.parse(storedUser);

    if (userData.farmDetails?.location) {
      fetchWeatherData(userData.farmDetails.location);
    }
  }, [router]);

  const fetchWeatherData = async (location: { lat: number; lng: number }) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lng}&units=metric&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
      );

      if (!response.ok) throw new Error('Failed to fetch weather data');

      const data = await response.json();
      
      // Group data by day and calculate averages
      const dailyData = (data.list as WeatherItem[]).reduce((acc: { [key: string]: WeatherItem[] }, item: WeatherItem) => {
        const date = startOfDay(new Date(item.dt * 1000)).toISOString();
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(item);
        return acc;
      }, {});

      // Calculate daily averages
      const processedData = Object.entries(dailyData).map(([date, items]: [string, WeatherItem[]]) => {
        const avgData = items.reduce((acc: { temperature: number; humidity: number; feelsLike: number; windSpeed: number }, item: WeatherItem) => {
          acc.temperature += item.main.temp;
          acc.humidity += item.main.humidity;
          acc.feelsLike += item.main.feels_like;
          acc.windSpeed += item.wind.speed;
          return acc;
        }, { temperature: 0, humidity: 0, feelsLike: 0, windSpeed: 0 });

        const count = items.length;
        
        // Use the most frequent weather description for the day
        const descriptions = items.map(item => item.weather[0].description);
        const mostFrequentDescription = descriptions.sort(
          (a: string, b: string) =>
            descriptions.filter((v: string) => v === a).length -
            descriptions.filter((v: string) => v === b).length
        ).pop();

        return {
          date: new Date(date),
          temperature: Math.round(avgData.temperature / count),
          humidity: Math.round(avgData.humidity / count),
          description: mostFrequentDescription || '',
          icon: items[Math.floor(count / 2)].weather[0].icon,
          feelsLike: Math.round(avgData.feelsLike / count),
          windSpeed: Math.round(avgData.windSpeed / count),
        };
      });

      setWeatherData(processedData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setLoading(false);
    }
  };

  const WeatherCard = ({ data }: { data: WeatherData }) => (
    <Card className="bg-neutral-800 border-neutral-700">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-lg font-medium text-white">
            {format(data.date, 'EEE, MMM d')}
          </p>
          {getWeatherIcon(data.description)}
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Thermometer className="h-5 w-5 text-orange-400" />
              <span className="text-sm text-neutral-400">Temperature</span>
            </div>
            <span className="text-lg font-semibold text-white">{data.temperature}°C</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-blue-400" />
              <span className="text-sm text-neutral-400">Humidity</span>
            </div>
            <span className="text-lg font-semibold text-white">{data.humidity}%</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wind className="h-5 w-5 text-green-400" />
              <span className="text-sm text-neutral-400">Wind Speed</span>
            </div>
            <span className="text-lg font-semibold text-white">{data.windSpeed} m/s</span>
          </div>

          <p className="text-sm text-neutral-400 capitalize pt-2 border-t border-neutral-700">
            {data.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-neutral-800 border-neutral-700">
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-neutral-700 rounded w-1/2" />
                    <div className="space-y-2">
                      <div className="h-4 bg-neutral-700 rounded" />
                      <div className="h-4 bg-neutral-700 rounded" />
                      <div className="h-4 bg-neutral-700 rounded" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                className="bg-neutral-800 border-neutral-700 hover:bg-neutral-700"
                onClick={() => router.push('/dashboard')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold text-white">Weather Insights</h1>
            </div>
            <p className="text-neutral-400">5-Day Forecast</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {weatherData.slice(0, 5).map((data, index) => (
              <WeatherCard key={index} data={data} />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
} 