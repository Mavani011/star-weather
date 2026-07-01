'use client';

import { useState, useEffect } from 'react';
import { FaSun } from 'react-icons/fa';
import { LuSunrise, LuSunset } from 'react-icons/lu';

interface SunPositionProps {
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

const SunPosition = ({ sunrise, sunset }: SunPositionProps) => {
  const [dayProgress, setDayProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const update = () => {
      setCurrentTime(new Date());
      setDayProgress(calculateSunProgress(sunrise, sunset));
    };

    update();

    const interval = setInterval(update, 1000);

    return () => clearInterval(interval);
  }, [sunrise, sunset]);

  const sunriseTime = new Date(sunrise * 1000);
  const sunsetTime = new Date(sunset * 1000);

  return (
    <section className="w-full max-w-md mx-auto">
      <div
        className="rounded-xl p-5 md:p-6 text-white shadow-xl"
        style={{
          background:
            'linear-gradient(135deg, rgba(217,219,64,0.9), rgba(236,197,22,0.89), rgba(235,162,27,0.82), rgba(224,75,49,0.85))',
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

        {/* Sunrise / Sunset */}
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

        {/* Progress Bar */}
        <div className="relative my-6 h-2 w-full rounded-full bg-gray-800">
          <div
            className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000"
            style={{
              width: `${dayProgress}%`,
              background: 'rgba(248,190,0,0.99)',
            }}
          />

          <FaSun
            className="absolute -top-3 transition-all duration-1000"
            style={{
              left: `${dayProgress}%`,
              transform: 'translateX(-50%)',
              fontSize: '1.8rem',
              color: '#FFD700',
            }}
          />
        </div>

        {/* Time Labels */}
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
