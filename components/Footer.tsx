// components/Footer.tsx
'use client';

import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaHeart, FaCloudSun, FaMoon, FaStarOfLife } from 'react-icons/fa';

// Animations
const moveLeftToRight = keyframes`
  0% { left: -30%; }
  100% { left: 100%; }
`;

const FooterAnimationWrapper = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 140px;
  overflow: hidden;
  pointer-events: none;
`;

const CarAnimation = styled.div`
  background: url("https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEia0PYPxwT5ifToyP3SNZeQWfJEWrUENYA5IXM6sN5vLwAKvaJS1pQVu8mOFFUa_ET4JuHNTFAxKURFerJYHDUWXLXl1vDofYXuij45JZelYOjEFoCOn7E6Vxu0fwV7ACPzArcno1rYuVxGB7JY6G7__e4_KZW4lTYIaHSLVaVLzklZBLZnQw047oq5-Q/s16000/volks.gif")
    no-repeat center center;
  background-size: contain;
  width: 330px;
  height: 110px;
  position: absolute;
  bottom: 0;
  animation: ${moveLeftToRight} 22s linear infinite;

  @media (max-width: 480px) {
    width: 180px;
    height: 90px;
  }
`;

const CyclistAnimation = styled.div`
  background: url("https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhyLGwEUVwPK6Vi8xXMymsc-ZXVwLWyXhogZxbcXQYSY55REw_0D4VTQnsVzCrL7nsyjd0P7RVOI5NKJbQ75koZIalD8mqbMquP20fL3DxsWngKkOLOzoOf9sMuxlbyfkIBTsDw5WFUj-YJiI50yzgVjF8cZPHhEjkOP_PRTQXDHEq8AyWpBiJdN9SfQA/s16000/cyclist.gif")
    no-repeat center center;
  background-size: contain;
  width: 88px;
  height: 100px;
  position: absolute;
  bottom: 0;
  left: 38%;
  animation: ${moveLeftToRight} 30s linear infinite;

  @media (max-width: 480px) {
    width: 60px;
    height: 80px;
  }
`;

const Footer: React.FC = () => {
  const [weatherIcon, setWeatherIcon] = useState(<FaStarOfLife className="text-yellow-300" />);

  useEffect(() => {
    const hour = new Date().getHours();
    setWeatherIcon(hour >= 6 && hour < 18
      ? <FaCloudSun className="text-orange-300" />
      : <FaMoon className="text-blue-200" />);
  }, []);

  return (
    <footer style={{background: "linear-gradient(1deg,rgba(70, 65, 65, 0.78),rgba(56, 52, 52, 0.25),rgb(4, 4, 4))"}} className="relative overflow-hidden bg-gradient-to-br from-black via-zinc-900 to-gray-950 text-gray-300 border-t border-gray-800 shadow-[0_-10px_30px_rgba(0,0,0,0.6)] z-10">
      {/* Background animated stars */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full animate-spin-slow-reverse" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" fill="none">
          <defs>
            <radialGradient id="starryGradient1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.0)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
            </radialGradient>
            <radialGradient id="starryGradient2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(100,100,255,0.0)" />
              <stop offset="100%" stopColor="rgba(100,100,255,0.07)" />
            </radialGradient>
          </defs>
          <circle cx="20" cy="30" r="0.7" fill="url(#starryGradient1)" className="animate-fade-in-out" />
          <circle cx="80" cy="70" r="1.0" fill="url(#starryGradient2)" className="animate-fade-in-out" />
          <circle cx="50" cy="10" r="0.8" fill="url(#starryGradient1)" className="animate-fade-in-out" />
          <circle cx="10" cy="90" r="1.1" fill="url(#starryGradient2)" className="animate-fade-in-out" />
          <circle cx="90" cy="20" r="0.6" fill="url(#starryGradient1)" className="animate-fade-in-out" />
        </svg>
      </div>

      {/* Footer content */}
      <div className="relative z-10 px-4 py-14 sm:py-10 text-center flex flex-col items-center justify-center">
        <div className="flex items-center justify-center text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-xl">
          <span className="animate-fade-in-up">
            <img src="icon.png" alt="Logo" style={{width:"5em"}}></img>
          </span>
          <span className="ml-3 text-4xl md:text-5xl animate-bounce-subtle">{weatherIcon}</span>
        </div>

        <p className="text-sm sm:text-base mb-4 flex items-center justify-center font-light text-gray-400 leading-relaxed">
          Crafted with <FaHeart className="text-red-500 mx-2 animate-pulse-fade" />
          by <b className="ml-2 font-semibold text-white hover:text-indigo-400 transition">Mavani</b>
        </p>

        <p className="text-xs sm:text-sm text-gray-500 opacity-70">
          &copy; {new Date().getFullYear()} Star Weather. All rights reserved.
        </p>
      </div>

      {/* Background animations */}
      <FooterAnimationWrapper>
        <CarAnimation />
        <CyclistAnimation />
      </FooterAnimationWrapper>
    </footer>
  );
};

export default Footer;
