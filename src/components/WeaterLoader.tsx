import React from 'react';

interface WeatherLoaderProps {
  size?: 'sm' | 'md' | 'lg'; // Para controlar el tamaño según dónde se use
  speedFactor?: number;      // 1 por defecto, menor número = más rápido, mayor = más lento
}

const WeatherLoader: React.FC<WeatherLoaderProps> = ({ 
  size = 'md', 
  speedFactor = 1 
}) => {
  // Calculamos la velocidad dinámica basada en la prop speedFactor
  const frontSpeed = `${8 * speedFactor}s`;
  const backSpeed = `${12 * speedFactor}s`;

  return (
    <div 
      className={`loader-weather-container size-${size}`}
      style={{ position: 'relative' }}
    >
      <div 
        className="loader-cloud front" 
        style={{ animationDuration: frontSpeed }}
      >
        <span className="loader-left-front"></span>
        <span className="loader-right-front"></span>
      </div>
      <span className="loader-sun loader-sunshine"></span>
      <span className="loader-sun"></span>
      <div 
        className="loader-cloud back" 
        style={{ animationDuration: backSpeed }}
      >
        <span className="loader-left-back"></span>
        <span className="loader-right-back"></span>
      </div>
    </div>
  );
};

export default WeatherLoader;