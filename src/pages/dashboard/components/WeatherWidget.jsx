import React from 'react';
import Icon from '../../../components/AppIcon';

const WeatherWidget = ({ weather }) => {
  const getWeatherIcon = (condition) => {
    const iconMap = {
      sunny: 'Sun',
      cloudy: 'Cloud',
      rainy: 'CloudRain',
      snowy: 'CloudSnow',
      stormy: 'CloudLightning',
      partly_cloudy: 'CloudSun'
    };
    return iconMap?.[condition] || 'Sun';
  };

  const getWeatherGradient = (condition) => {
    const gradientMap = {
      sunny: 'from-yellow-400 to-orange-500',
      cloudy: 'from-gray-400 to-gray-600',
      rainy: 'from-blue-400 to-blue-600',
      snowy: 'from-blue-200 to-blue-400',
      stormy: 'from-purple-500 to-gray-700',
      partly_cloudy: 'from-yellow-300 to-blue-400'
    };
    return gradientMap?.[condition] || 'from-yellow-400 to-orange-500';
  };

  return (
    <div className="bg-card rounded-lg border border-gray-200 shadow-soft p-6 relative overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${getWeatherGradient(weather?.condition)} opacity-5`}></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 bg-gradient-to-br ${getWeatherGradient(weather?.condition)} rounded-lg flex items-center justify-center shadow-medium`}>
              <Icon name={getWeatherIcon(weather?.condition)} size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Weather</h2>
              <p className="text-sm text-muted-foreground">{weather?.location}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-foreground">{weather?.temperature}°</div>
            <div className="text-sm text-muted-foreground">{weather?.condition_text}</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <Icon name="Droplets" size={16} className="text-blue-500 mx-auto mb-1" />
            <div className="text-sm font-medium text-foreground">{weather?.humidity}%</div>
            <div className="text-xs text-muted-foreground">Humidity</div>
          </div>
          <div className="text-center">
            <Icon name="Wind" size={16} className="text-gray-500 mx-auto mb-1" />
            <div className="text-sm font-medium text-foreground">{weather?.wind_speed} mph</div>
            <div className="text-xs text-muted-foreground">Wind</div>
          </div>
          <div className="text-center">
            <Icon name="Eye" size={16} className="text-purple-500 mx-auto mb-1" />
            <div className="text-sm font-medium text-foreground">{weather?.visibility} mi</div>
            <div className="text-xs text-muted-foreground">Visibility</div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Feels like</span>
            <span className="font-medium text-foreground">{weather?.feels_like}°</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;

