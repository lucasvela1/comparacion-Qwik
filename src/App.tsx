import { useState } from 'react';
import { fetchTemperatura, fetchPrecipitaciones } from './services/clima';
import WeatherModal from './components/weatherModal';


const CIUDADES = {
  ushuaia: { name: 'Ushuaia', lat: -54.8019, lon: -68.303, emoji: '🏔️' },
  rio_grande: { name: 'Río Grande', lat: -53.7877, lon: -67.7032, emoji: '🌾' },
  tolhuin: { name: 'Tolhuin', lat: -54.5106, lon: -67.1923, emoji: '🌲' },
};

function App() {
  //En React se agrupa el estado en un único objeto usando useState para replicar el useStore de Qwik
  const [state, setState] = useState({
    ciudadSeleccionada: 'ushuaia' as keyof typeof CIUDADES,
    loading: false,
    tempData: null as number | null,
    precipData: null as number | null,
    showModalTemp: false,
    showModalPrecip: false,
  });

  const verTemperatura = async () => {
    setState(prev => ({ ...prev, loading: true, showModalTemp: true }));
    const geo = CIUDADES[state.ciudadSeleccionada];
    
    try {
      const data = await fetchTemperatura(geo.lat, geo.lon);
      setState(prev => ({ ...prev, tempData: data }));
    } catch {
      setState(prev => ({ ...prev, tempData: null }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const verPrecipitaciones = async () => {
    setState(prev => ({ ...prev, loading: true, showModalPrecip: true }));
    const geo = CIUDADES[state.ciudadSeleccionada];

    try {
      const data = await fetchPrecipitaciones(geo.lat, geo.lon);
      setState(prev => ({ ...prev, precipData: data }));
    } catch {
      setState(prev => ({ ...prev, precipData: null }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  return (
    <div style={containerStyle}>
      {/* Background decorativo */}
      <div style={bgDecorativeStyle}></div>
      
      {/* Header */}
      <header style={headerStyle}>
        <h1 style={titleStyle}>Clima TDF</h1>
        <p style={subtitleStyle}>Tierra del Fuego, Argentina</p>
      </header>

      {/* Card principal */}
      <div style={cardStyle}>
        {/* Selector de ciudad */}
        <div style={selectorContainerStyle}>
          <label htmlFor="city-select" style={labelStyle}>
            Selecciona tu ubicación
          </label>
          <select
            id="city-select"
            value={state.ciudadSeleccionada}
            onChange={(e) => {
              const valor = e.target.value as keyof typeof CIUDADES;
              setState(prev => ({ ...prev, ciudadSeleccionada: valor }));
            }}
            style={selectStyle}
          >
            <option value="ushuaia">🏔️ Ushuaia</option>
            <option value="rio_grande">🌾 Río Grande</option>
            <option value="tolhuin">🌲 Tolhuin</option>
          </select>
        </div>

        {/* Botones de acción */}
        <div style={buttonContainerStyle}>
          <button 
            onClick={verTemperatura} 
            style={buttonStyle}
            className="btn-primary"
          >
            <span style={buttonIconStyle}>🌡️</span>
            Temperatura
          </button>
          <button 
            onClick={verPrecipitaciones} 
            style={buttonStyle}
            className="btn-secondary"
          >
            <span style={buttonIconStyle}>💧</span>
            Precipitaciones
          </button>
        </div>
      </div>

      {/* Modales */}
      <WeatherModal
        isOpen={state.showModalTemp}
        title={CIUDADES[state.ciudadSeleccionada === undefined ? state.ciudadSeleccionada : state.ciudadSeleccionada].name}
        emoji="🌡️"
        value={state.tempData}
        unit="°C"
        loading={state.loading}
        onClose={() => {
          setState(prev => ({ ...prev, showModalTemp: false, tempData: null }));
        }}
      />

      <WeatherModal
        isOpen={state.showModalPrecip}
        title={CIUDADES[state.ciudadSeleccionada].name}
        emoji="💧"
        value={state.precipData}
        unit="milímetros"
        loading={state.loading}
        onClose={() => {
          setState(prev => ({ ...prev, showModalPrecip: false, precipData: null }));
        }}
      />
    </div>
  );
}

// ==================== ESTILOS ====================

const containerStyle = {
  minHeight: '100vh',
  padding: '20px',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3d4e6 100%)',
  fontFamily: "'Inter', sans-serif",
  position: 'relative' as const,
  overflow: 'hidden',
};

const bgDecorativeStyle = {
  position: 'fixed' as const,
  top: '-50%',
  right: '-10%',
  width: '800px',
  height: '800px',
  borderRadius: '50%',
  background: 'radial-gradient(circle, rgba(41, 128, 185, 0.08) 0%, transparent 70%)',
  pointerEvents: 'none' as const,
  zIndex: 0,
};

const headerStyle = {
  textAlign: 'center' as const,
  marginBottom: '40px',
  position: 'relative' as const,
  zIndex: 1,
};

const titleStyle = {
  fontSize: '48px',
  fontWeight: 700,
  fontFamily: "'Syne', sans-serif",
  color: '#1a3a52',
  marginBottom: '8px',
  letterSpacing: '-1px',
};

const subtitleStyle = {
  fontSize: '16px',
  color: '#5a7285',
  fontWeight: 400,
  letterSpacing: '0.5px',
};

const cardStyle = {
  maxWidth: '500px',
  margin: '0 auto 40px',
  background: 'rgba(53, 105, 143, 0.95)',
  borderRadius: '20px',
  padding: '40px 30px',
  boxShadow: '0 20px 60px rgba(26, 58, 82, 0.3)',
  backdropFilter: 'blur(10px)',
  position: 'relative' as const,
  zIndex: 1,
};

const selectorContainerStyle = {
  marginBottom: '32px',
};

const labelStyle = {
  display: 'block' as const,
  fontSize: '14px',
  fontWeight: 600,
  color: '#ffffff',
  marginBottom: '12px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
};

const selectStyle = {
  width: '100%',
  padding: '14px 16px',
  fontSize: '16px',
  border: '2px solid #cccccc',
  borderRadius: '12px',
  background: '#ffffff',
  color: '#1a3a52',
  fontFamily: "'Inter', sans-serif",
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  fontWeight: 500,
};

const buttonContainerStyle = {
  display: 'flex' as const,
  gap: '16px',
  justifyContent: 'stretch',
};

const buttonStyle = {
  flex: 1,
  padding: '14px 20px',
  fontSize: '15px',
  fontWeight: 600,
  border: 'none',
  borderRadius: '12px',
  color: '#000000',
  cursor: 'pointer',
  display: 'flex' as const,
  alignItems: 'center' as const,
  justifyContent: 'center',
  gap: '8px',
  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
  fontFamily: "'Inter', sans-serif",
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
};

const buttonIconStyle = {
  fontSize: '18px',
 };

export default App;