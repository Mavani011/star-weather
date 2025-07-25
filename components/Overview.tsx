import { FaClock, FaThermometerHalf } from 'react-icons/fa';
import { MdLocationPin } from 'react-icons/md';
import LocalDate from './LocalDate';
import weatherGradients from '../utils/weatherGradients';
import weatherBackgrounds from '../utils/weatherBackgrounds';

type WeatherData = {
  dt: number;
  temp: number;
  feels_like: number;
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
};

type CityData = {
  name: string;
  country: string;
  lat: number;
  lon: number;
};

interface OverViewProps {
  data: WeatherData;
  city: CityData;
}

// Country name mapping
const countryNames: { [code: string]: string } = {
  IN: 'India',
  US: 'United States',
  GB: 'United Kingdom',
  FR: 'France',
  DE: 'Germany',
  CA: 'Canada',
  AU: 'Australia',
  CN: 'China',
  JP: 'Japan',
  IT: 'Italy',
  RU: 'Russia',
  BR: 'Brazil',
  ES: 'Spain',
  MX: 'Mexico',
  KR: 'South Korea',
  SA: 'Saudi Arabia',
  AE: 'United Arab Emirates',
  AR: 'Argentina',
  ZA: 'South Africa',
  NG: 'Nigeria',
  EG: 'Egypt',
  PK: 'Pakistan',
  BD: 'Bangladesh',
  ID: 'Indonesia',
  TH: 'Thailand',
  NL: 'Netherlands',
  SE: 'Sweden',
  NO: 'Norway',
  DK: 'Denmark',
  CH: 'Switzerland',
  BE: 'Belgium',
  PL: 'Poland',
  GR: 'Greece',
  PT: 'Portugal',
  TR: 'Turkey',
  SG: 'Singapore',
  MY: 'Malaysia',
  PH: 'Philippines',
  NZ: 'New Zealand',
  IL: 'Israel',
  IR: 'Iran',
  IQ: 'Iraq',
  QA: 'Qatar',
  KW: 'Kuwait',
  UA: 'Ukraine',
  AT: 'Austria',
  FI: 'Finland',
  CZ: 'Czech Republic',
  HU: 'Hungary',
  RO: 'Romania',
  SK: 'Slovakia',
  BG: 'Bulgaria',
  VE: 'Venezuela',
  CL: 'Chile',
  CO: 'Colombia',
  PE: 'Peru',
  KH: 'Cambodia',
  LK: 'Sri Lanka',
  NP: 'Nepal',
  MM: 'Myanmar',
  VN: 'Vietnam',
  TW: 'Taiwan',
  HK: 'Hong Kong',
  KZ: 'Kazakhstan',
  UZ: 'Uzbekistan',
  BY: 'Belarus',
  GE: 'Georgia',
  AZ: 'Azerbaijan',
  MA: 'Morocco',
  TN: 'Tunisia',
  SD: 'Sudan',
  ET: 'Ethiopia',
  KE: 'Kenya',
  TZ: 'Tanzania',
  UG: 'Uganda',
  GH: 'Ghana',
  CI: 'Ivory Coast',
  CM: 'Cameroon',
  DZ: 'Algeria'
  // Add more if needed
};

// Flag emoji function
const getFlagEmoji = (countryCode: string) => {
  return countryCode
    .toUpperCase()
    .replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt(0)));
};

const OverView: React.FC<OverViewProps> = ({ data, city }) => {
  const condition = data?.weather?.[0]?.main || 'Default';
  const isRain = ['Rain', 'Drizzle', 'Thunderstorm'].includes(condition);

  const gradient = weatherGradients[condition] || weatherGradients.Default;
  const backgroundGif = isRain
    ? '/rainy.gif'
    : weatherBackgrounds[condition] || weatherBackgrounds.Default;

  const countryName = city?.country ? countryNames[city.country] || city.country : '';
  const flagEmoji = city?.country ? getFlagEmoji(city.country) : '';

  return (
    <div
      className="relative rounded-xl text-white overflow-hidden shadow-lg transition-all duration-300"
      style={{
        backgroundImage: isRain
          ? `url(${backgroundGif})`
          : `${gradient}, url(${backgroundGif})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundBlendMode: isRain ? 'normal' : 'overlay',
      }}
    >
      <div className={`${isRain ? 'bg-black/40' : 'bg-black/30'} p-4 md:p-6 rounded-xl`}>
        <div className="flex justify-between font-medium">
          <h3 className="text-sm md:text-base mb-3 text-gray-200">
            <MdLocationPin className="inline-block mr-1" />
            {city?.name}
            {countryName && `, ${countryName} ${flagEmoji}`}
          </h3>
          <p className="text-xs md:text-sm uppercase text-gray-300">
            <FaClock className="mr-1 inline-block" />
            <LocalDate date={data?.dt * 1000} />
          </p>
        </div>

        <div className="my-4 flex items-center justify-between">
          <div>
            <h2 className="text-5xl font-semibold md:text-6xl drop-shadow-md">
              {data?.temp?.toFixed(0)}°
            </h2>
            <p className="mt-1 text-gray-200 text-sm md:text-base">
              <FaThermometerHalf className="inline-block mr-1" />
              Feels like: {data?.feels_like?.toFixed(1)}°
            </p>
          </div>
          <img
            src={`https://openweathermap.org/img/wn/${data?.weather?.[0]?.icon}@4x.png`}
            alt={data?.weather?.[0]?.description || 'weather icon'}
            className="-my-8 size-28 md:-mx-4 md:size-36 drop-shadow-md"
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm text-gray-300">
          <p className="capitalize text-base font-medium text-white">
            {data?.weather?.[0]?.description || 'Weather Info'}
          </p>
          <p className="hidden md:inline-block">Lat: {city?.lat?.toFixed(3)}°</p>
          <p className="hidden md:inline-block">Lon: {city?.lon?.toFixed(3)}°</p>
        </div>
      </div>
    </div>
  );
};

export default OverView;
