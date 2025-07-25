'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MdLocationPin } from 'react-icons/md';
import { FaSearch } from 'react-icons/fa';
import { IoIosArrowDown } from 'react-icons/io';
import { IoClose } from 'react-icons/io5';

interface City {
  id: number;
  city: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
}

const normalizeCityName = (input: string): string => {
  const cleaned = input.trim().replace(/\s+/g, ' ').toLowerCase();
  if (cleaned.endsWith(', india')) return cleaned.replace(', india', ', IN');
  const majorCityNamesLower = allMajorCities.map(c => c.toLowerCase());
  if (majorCityNamesLower.includes(cleaned.split(',')[0].trim())) {
    if (!cleaned.includes(',')) { // Only append if country code isn't already there
      return `${cleaned}, IN`;
    }
  }
  return cleaned;
};


const highlightMatch = (text: string, match: string) => {
  const index = text.toLowerCase().indexOf(match.toLowerCase());
  if (index === -1) return text;
  return (
    <>
      {text.substring(0, index)}
      <span className="font-semibold text-blue-600">
        {text.substring(index, index + match.length)}
      </span>
      {text.substring(index + match.length)}
    </>
  );
};

const allMajorCities = [
  'Ahmedabad', 'Bengaluru', 'Bhopal', 'Chandigarh', 'Chennai', 'Delhi', 'Ghaziabad',
  'Hyderabad', 'Indore', 'Jaipur', 'Kanpur', 'Kolkata', 'Lucknow', 'Ludhiana',
  'Mumbai', 'Nagpur', 'Patna', 'Pune', 'Raipur', 'Rajkot', 'Ranchi', 'Surat',
  'Thane', 'Vadodara', 'Varanasi', 'Visakhapatnam'
];

const SearchBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<City[]>([]);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [notFound, setNotFound] = useState(false);
  const [isLocating, setIsLocating] = useState(false); // New state for location loading
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const defaultValue = searchParams.get('q') || '';
    setQuery(defaultValue);
  }, [searchParams]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      setActiveIndex(-1);
      setNotFound(false);
      return;
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      fetch(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${query}&limit=10&sort=-population`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': 'cca864c1acmshd20d295d5175645p19b1c2jsn725facd4d9b2',
          'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com',
        },
      })
        .then(res => res.json())
        .then(data => {
          const all = data.data || [];
          const filtered = all.filter((city: City) => !/district|township/i.test(city.city));
          const formatted = filtered.map((c, i) => ({
            ...c,
            id: i,
            city: `${c.city}, ${c.countryCode.toUpperCase()}`
          }));

          formatted.sort((a, b) => {
            if (a.countryCode === 'IN' && b.countryCode !== 'IN') return -1;
            if (a.countryCode !== 'IN' && b.countryCode === 'IN') return 1;
            return 0;
          });

          setSuggestions(formatted);
          setDropdownOpen(true);
          setActiveIndex(-1);
          setNotFound(formatted.length === 0);
        })
        .catch(() => {
          setSuggestions([]);
          setActiveIndex(-1);
          setNotFound(true);
        });
    }, 300);
  }, [query]);

  useEffect(() => {
    if (!searchParams.get('q')) { // Check if a city is already in the URL
      if (navigator.geolocation) {
        setIsLocating(true); // Set loading state
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const res = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${position.coords.latitude}+${position.coords.longitude}&key=c6df5651d72f48cf833872ccbb6a2b04`); // IMPORTANT: Replace with your actual OpenCageData Key
              const data = await res.json();
              const city = data?.results?.[0]?.components?.city || data?.results?.[0]?.components?.town || data?.results?.[0]?.components?.village;
              
              if (city) {
                const formatted = normalizeCityName(city); // Use your existing normalizer
                setQuery(formatted);
                router.push(`/?q=${encodeURIComponent(formatted)}`);
                setNotFound(false);
              } else {
                setNotFound(true);
                router.push(`/?q=`); // Clear query if city not found
              }
            } catch (err) {
              console.error('Error reverse geocoding:', err);
              setNotFound(true);
              router.push(`/?q=`); // Clear query on error
            } finally {
              setIsLocating(false);
            }
          },
          (err) => {
         
            console.warn('Geolocation Error:', err);
            setIsLocating(false);
            // }
          },
          {
            enableHighAccuracy: true,
            timeout: 10000, // Increased timeout for initial location
            maximumAge: 0
          }
        );
      } else {
        console.warn('Geolocation is not supported by this browser.');
        // Handle no geolocation support (e.g., set default city)
        setIsLocating(false);
      }
    }
  }, [router, searchParams]); // Run once on mount and if searchParams change (e.g., first load)


  const handleSelect = (city: City | string) => {
    const cityName = typeof city === 'string' ? city : city.city;
    const fixedCity = normalizeCityName(cityName);
    setQuery(fixedCity);
    setSuggestions([]);
    setDropdownOpen(false);
    setActiveIndex(-1);
    setNotFound(false);
    router.push(`/?q=${encodeURIComponent(fixedCity)}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = normalizeCityName(query);

    if (!normalized.trim()) {
      router.push(`/?q=`);
      setNotFound(true);
      return;
    }

    setNotFound(false);
    router.push(`/?q=${encodeURIComponent(normalized)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!suggestions.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    }
    if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[activeIndex]);
    }
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
    setSuggestions([]);
    setNotFound(false);
    router.push(`/?q=`); // Clear URL query as well
  };

  const handleGetCurrentLocation = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true); // Set loading state
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      try {
        const res = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${coords.latitude}+${coords.longitude}&key=c6df5651d72f48cf833872ccbb6a2b04`); // IMPORTANT: Replace with your actual OpenCageData Key
        const data = await res.json();
        const city = data?.results?.[0]?.components?.city || data?.results?.[0]?.components?.town || data?.results?.[0]?.components?.village;
        if (city) {
          const formatted = normalizeCityName(city);
          setQuery(formatted);
          setNotFound(false);
          router.push(`/?q=${encodeURIComponent(formatted)}`);
        } else {
          setNotFound(true);
          router.push(`/?q=`);
        }
      } catch (err) {
        setNotFound(true);
        router.push(`/?q=`);
        console.error('Error reverse geocoding:', err); 
      } finally {
        setIsLocating(false); // Clear loading state
      }
    }, (err) => {
        console.warn('Geolocation manual request error:', err);
        setIsLocating(false); 
        if (err.code === err.PERMISSION_DENIED) {
             errorMsg = 'Location access denied. Please allow location in your browser settings to use this feature.';
        } else if (err.code === err.TIMEOUT) {
            errorMsg = 'Getting location timed out. Please try again.';
        }
        alert(errorMsg); 
    });
  };

  return (
    <div>
      <div ref={containerRef} className="flex items-center justify-between gap-6 flex-wrap px-6 py-4 mb-8">
        <div className="flex items-center gap-2 p-2 m-1">
          <img src="icon.png" alt="Logo" className="w-[260px] object-contain" />
        </div>

        <div className="relative w-full md:max-w-xl">
          <form onSubmit={handleSubmit} className="flex items-center bg-gray-700/75 backdrop-blur-sm rounded-full px-3 py-2 w-full max-w-full overflow-hidden">
            <div className="relative group flex-shrink-0">
              <MdLocationPin
                onClick={handleGetCurrentLocation}
                title={isLocating ? 'Getting location...' : 'Get current location'}
                className={`text-white text-xl mr-2 cursor-pointer transition ${isLocating ? 'animate-pulse' : 'hover:text-blue-400'}`}
              />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value.replace(/\s+/g, ' '))}
              onFocus={() => setDropdownOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder={isLocating ? 'Fetching location...' : 'Enter city name'}
              className="flex-grow min-w-0 bg-transparent text-white placeholder-gray-300 outline-none"
              disabled={isLocating} // Disable input while locating
            />
            {query && (
              <IoClose onClick={handleClear} className="text-white text-xl mx-1 cursor-pointer hover:text-red-400 transition flex-shrink-0" title="Clear input" />
            )}
            <IoIosArrowDown onClick={() => setDropdownOpen(!isDropdownOpen)} className={`text-white text-lg cursor-pointer mx-2 transition-transform flex-shrink-0 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            <button type="submit" className="text-white hover:text-blue-400 flex-shrink-0" aria-label="Search">
              <FaSearch className="text-lg" />
            </button>
          </form>

          {isDropdownOpen && suggestions.length > 0 && (
            <ul className="animate-fadeIn absolute top-full mt-2 w-full bg-gradient-to-b from-gray-100/80 to-gray-200/90 backdrop-blur-md text-black rounded-lg shadow-xl max-h-64 overflow-y-auto z-50">
              {suggestions.map((city, index) => (
                <li
                  key={city.id}
                  onClick={() => handleSelect(city.city)}
                  className={`px-4 py-2 flex items-center gap-2 cursor-pointer ${index === activeIndex ? 'bg-gray-400 text-white font-semibold' : 'hover:bg-gray-300'}`}
                >
                  <MdLocationPin className="text-blue-600" />
                  {highlightMatch(city.city, query)}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;