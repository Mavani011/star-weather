'use client';

import { useState, useEffect } from 'react';
import { FaSun } from 'react-icons/fa';
import { LuSunrise, LuSunset } from 'react-icons/lu';

// Your OpenWeather API
const OPENWEATHER_API_KEY = 'a3cd0e9cf70bfaa4bf784c33adccebf2';
const LATITUDE = 21.1702;
const LONGITUDE = 72.8311;

interface SunData {
  sunrise: number;
  sunset: number;
}

const calculateSunProgress = (sunrise: number, sunset: number): number => {
  const now = Date.now();
  const sunriseMs = sunrise * 1000;
  const sunsetMs = sunset * 1000;

  if (now < sunriseMs) return 0;
  if (now > sunsetMs) return 100;

  const totalDay = sunsetMs - sunriseMs;
  const elapsed = now - sunriseMs;
  return parseFloat(((elapsed / totalDay) * 100).toFixed(2));
};

const SunPosition = () => {
  const [sunData, setSunData] = useState<SunData | null>(null);
  const [dayProgress, setDayProgress] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch sunrise/sunset
  useEffect(() => {
    const fetchSunData = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${LATITUDE}&lon=${LONGITUDE}&appid=${OPENWEATHER_API_KEY}&units=metric`
        );
        const data = await response.json();

        if (data.sys?.sunrise && data.sys?.sunset) {
          setSunData({
            sunrise: data.sys.sunrise,
            sunset: data.sys.sunset,
          });
        } else {
          throw new Error('Sunrise/sunset data missing.');
        }
      } catch (err) {
        console.error('Sun data error:', err);
        setError('Failed to load sun data.');
      } finally {
        setLoading(false);
      }
    };

    fetchSunData();
  }, []);

  // Update progress every second
  useEffect(() => {
    const update = () => {
      setCurrentTime(new Date());
      if (sunData) {
        const progress = calculateSunProgress(sunData.sunrise, sunData.sunset);
        setDayProgress(progress);
      }
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [sunData]);

  if (loading) return <p className="text-center text-white">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!sunData) return <p className="text-center text-gray-400">No sun data.</p>;

  const sunriseTime = new Date(sunData.sunrise * 1000);
  const sunsetTime = new Date(sunData.sunset * 1000);

  return (
    <section className="w-full max-w-md mx-auto">
      <div
        className="rounded-xl p-5 md:p-6 text-white shadow-xl"
        style={{
          background: 'linear-gradient(135deg,rgba(217, 219, 64, 0.9) ,rgba(236, 197, 22, 0.89) ,rgba(235, 162, 27, 0.82) ,rgba(224, 75, 49, 0.85) )',
        }}
      >
        {/* Digital Clock */}
        <div className="text-center text-lg md:text-2xl font-bold mb-4">
          {currentTime.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
          })}
        </div>

        {/* Sunrise/Sunset Icons */}
        <div className="flex justify-between text-xs md:text-base mb-1">
          <div className="flex flex-col items-start">
            <LuSunrise className="text-2xl md:text-3xl" />
            <span>Sunrise</span>
          </div>
          <div className="flex flex-col items-end">
            <LuSunset className="text-2xl md:text-3xl" />
            <span>Sunset</span>
          </div>
        </div>

        {/* 🌞 Sun Progress Bar */}
        <div className="relative my-6 h-2 w-full rounded-full bg-gray-800">
          {/* Progress fill */}
          <div
            className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-in-out"
            style={{ width: `${dayProgress}%`,background:"rgba(248, 190, 0, 0.99)" }}
          />

          {/* Sun icon moving on top */}
          <FaSun
            className="absolute -top-3 text-yellow-400 transition-all duration-1000 ease-in-out"
            style={{
              left: `${dayProgress}%`,
              transform: 'translateX(-50%)',
              fontSize: '1.8rem',
              color:"rgb(255, 217, 1)"
            }}
          />
        </div>

        {/* Time labels */}
        <div className="flex justify-between font-medium uppercase text-sm md:text-base">
          <span>
            {sunriseTime.toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })}
          </span>
          <span>
            {sunsetTime.toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })}
          </span>
        </div>
      </div>
    </section>
  );
};

export default SunPosition;
