import React, { useState, useEffect } from 'react';
import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, Sun, Thermometer, Droplets, Wind, MapPin } from 'lucide-react';
import axios from 'axios';

const getWeatherStyles = (code) => {
  if (code === 0) return { 
    icon: <Sun className="text-yellow-400" size={48} />, 
    bgIcon: <Sun size={240} className="text-yellow-300 opacity-20 animate-[spin_20s_linear_infinite]" />,
    gradient: 'from-sky-400 to-blue-500',
    label: 'Clear Sky' 
  };
  if ([1, 2, 3].includes(code)) return { 
    icon: <Cloud className="text-white" size={48} />, 
    bgIcon: <Cloud size={240} className="text-white opacity-10 animate-float-slow" />,
    gradient: 'from-blue-400 to-slate-500',
    label: 'Partly Cloudy' 
  };
  if ([45, 48].includes(code)) return { 
    icon: <CloudFog className="text-gray-200" size={48} />, 
    bgIcon: <CloudFog size={240} className="text-white opacity-10 animate-pulse-slow" />,
    gradient: 'from-gray-400 to-slate-600',
    label: 'Fog' 
  };
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { 
    icon: <CloudRain className="text-blue-100" size={48} />, 
    bgIcon: <CloudRain size={240} className="text-white opacity-10 animate-float-slow" />,
    gradient: 'from-slate-500 to-slate-800',
    label: 'Rain' 
  };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { 
    icon: <CloudSnow className="text-blue-50" size={48} />, 
    bgIcon: <CloudSnow size={240} className="text-white opacity-10 animate-float-slow" />,
    gradient: 'from-blue-300 to-slate-400',
    label: 'Snow' 
  };
  if ([95, 96, 99].includes(code)) return { 
    icon: <CloudLightning className="text-yellow-300" size={48} />, 
    bgIcon: <CloudLightning size={240} className="text-yellow-500 opacity-10 animate-pulse-slow" />,
    gradient: 'from-slate-700 to-slate-900',
    label: 'Thunderstorm' 
  };
  return { 
    icon: <Sun className="text-yellow-400" size={48} />, 
    bgIcon: <Sun size={240} className="text-yellow-300 opacity-20 animate-[spin_20s_linear_infinite]" />,
    gradient: 'from-sky-400 to-blue-500',
    label: 'Clear Sky' 
  };
};

const WeatherWidget = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Reverse geocoding to get a rough city name (using a free open-meteo geocoding or bigdatacloud API)
          // For simplicity, we just display "Current Location" if reverse geocoding is too complex,
          // but let's try a free reverse geocoding API to make it premium.
          let locationName = "Your Farm";
          try {
             const geoRes = await axios.get(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
             if (geoRes.data?.city || geoRes.data?.locality) {
                 locationName = geoRes.data.city || geoRes.data.locality;
             }
          } catch(e) {
             // Silently ignore reverse geocode failure
          }

          const res = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`);
          
          setWeatherData({
            ...res.data.current,
            locationName,
            daily: res.data.daily
          });
        } catch (err) {
          setError("Failed to fetch weather data");
        } finally {
          setIsLoading(false);
        }
      },
      (err) => {
        setError("Location access denied. Please enable location to view local weather.");
        setIsLoading(false);
      }
    );
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm h-full flex items-center justify-center min-h-[320px]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-gray-200 rounded-full mb-3"></div>
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !weatherData) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-white rounded-3xl p-6 border border-blue-100 shadow-sm h-full flex flex-col items-center justify-center min-h-[320px] text-center">
        <MapPin className="text-blue-300 mb-2" size={32} />
        <p className="text-sm font-medium text-gray-600 px-4">{error || "Could not load weather"}</p>
      </div>
    );
  }

  const { icon, bgIcon, gradient, label } = getWeatherStyles(weatherData.weather_code);

  return (
    <div className={`group bg-gradient-to-br ${gradient} rounded-3xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300 h-full relative overflow-hidden text-white flex flex-col justify-between min-h-[320px]`}>
      
      {/* Dynamic Animated Background SVG */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
        {bgIcon}
      </div>

      {/* Cloud Blobs */}
      <div className="absolute top-0 -left-10 w-40 h-40 bg-white/10 rounded-full mix-blend-overlay filter blur-xl animate-blob"></div>
      <div className="absolute -bottom-10 right-0 w-48 h-48 bg-white/10 rounded-full mix-blend-overlay filter blur-xl animate-blob animation-delay-2000"></div>

      {/* Shimmer Sweep Effect */}
      <div className="absolute top-0 inset-x-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent z-10 pointer-events-none animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative z-10 flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg flex items-center gap-1.5 opacity-90 drop-shadow-md"><MapPin size={16} /> {weatherData.locationName}</h3>
          <p className="text-xs opacity-75 font-medium mt-0.5 drop-shadow-md">Today's Weather</p>
        </div>
        <div className="bg-white/20 backdrop-blur-md p-2.5 rounded-2xl border border-white/20 shadow-lg group-hover:scale-110 transition-transform duration-300">
           {icon}
        </div>
      </div>

      <div className="relative z-10 mt-6 flex items-end justify-between">
        <div className="group-hover:translate-x-2 transition-transform duration-300">
          <div className="flex items-start drop-shadow-lg">
            <span className="text-7xl font-black tracking-tighter">{Math.round(weatherData.temperature_2m)}</span>
            <span className="text-2xl font-bold mt-2 opacity-80">°C</span>
          </div>
          <p className="text-lg font-bold opacity-90 mt-1 drop-shadow-md">{label}</p>
        </div>
        
        <div className="flex flex-col gap-2 text-xs font-bold opacity-90 group-hover:-translate-x-2 transition-transform duration-300">
          <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/10 shadow-sm">
            <Droplets size={16} className="text-blue-200" /> {weatherData.relative_humidity_2m}% Humidity
          </div>
          <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/10 shadow-sm">
            <Wind size={16} className="text-gray-200" /> {weatherData.wind_speed_10m} km/h
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
