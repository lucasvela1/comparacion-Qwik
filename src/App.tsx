import { useEffect, useState } from 'react';
import { fetchPrecipitaciones } from './services/precipitaciones';
import { fetchTemperatura } from './services/temperaturas';
import WeatherModal from './components/WeatherModal';


const CIUDADES = {
  ushuaia: { nombre: 'Ushuaia', lat: -54.8019, lon: -68.303, emoji: '🏔️' },
  rio_grande: { nombre: 'Río Grande', lat: -53.7877, lon: -67.7032, emoji: '🌾' },
  tolhuin: { nombre: 'Tolhuin', lat: -54.5106, lon: -67.1923, emoji: '🌲' },
};

interface Ciudad {
  nombre: string;
  lat: number;
  lon: number;
  emoji: string;
}
function App() {
  const [state, setState] = useState({
    ciudades: { ...CIUDADES } as Record<string, Ciudad>,
    ciudadSeleccionada: 'ushuaia' as string, 
    loading: false,
    tempData: null as number | null,
    precipData: null as number | null,
    showModalTemp: false,
    showModalPrecip: false,
    
    nuevoNombreCiudad: '',
    nuevaLatitud: '',
    nuevaLongitud: '',
  });

  
  useEffect(() => {
    const locales = localStorage.getItem('ciudadesCustom');
    if (locales) {
      try {
        const parsedCustom = JSON.parse(locales);
        setState(prev => ({
          ...prev,
          ciudades: { ...CIUDADES, ...parsedCustom }
        }));
      } catch (e) {
        console.error("Error al parsear ciudades del localStorage", e);
      }
    }
  }, []); 

  const ciudadActual = state.ciudades[state.ciudadSeleccionada] || CIUDADES['ushuaia'];
  const agregarCiudad = () => {
    const nombre = state.nuevoNombreCiudad.trim();
    const lat = parseFloat(state.nuevaLatitud);
    const lon = parseFloat(state.nuevaLongitud);
    
    if (!nombre || isNaN(lat) || isNaN(lon)) {
      alert("Por favor completa todos los campos con valores numéricos válidos.");
      return;
    }
    
    const key = nombre.toLowerCase().replace(/\s+/g, '_');
    
    const nuevaCiudad: Ciudad = {
      nombre,
      lat,
      lon,
      emoji: '🏙️'
    };

    const locales = localStorage.getItem('ciudadesCustom');
    const ciudadesCustom = locales ? JSON.parse(locales) : {};
    ciudadesCustom[key] = nuevaCiudad;
    localStorage.setItem('ciudadesCustom', JSON.stringify(ciudadesCustom));

    setState(prev => ({
      ...prev,
      ciudades: {
        ...prev.ciudades,
        [key]: nuevaCiudad
      },
      ciudadSeleccionada: key,
      nuevoNombreCiudad: '',
      nuevaLatitud: '',
      nuevaLongitud: '',
    }));
  };

  const verTemperatura = async () => {
    setState(prev => ({ ...prev, loading: true, showModalTemp: true }));
    const geo = state.ciudades[state.ciudadSeleccionada];
    if (!geo) return;
    
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
    const geo = state.ciudades[state.ciudadSeleccionada];
    if (!geo) return;

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
      <div style={bgDecorativeStyle}></div>
      
      <header style={headerStyle}>
        <h1 style={titleStyle}>Clima TDF</h1>
        <p style={subtitleStyle}>Tierra del Fuego, Argentina</p>
      </header>

      {/* Card principal */}
      <div style={cardStyle}>
        <div style={selectorContainerStyle}>
          <label htmlFor="city-select" style={labelStyle}>
            Selecciona tu ubicación
          </label>
          <select
            id="city-select"
            value={state.ciudadSeleccionada}
            onChange={(e) => {
              setState(prev => ({ ...prev, ciudadSeleccionada: e.target.value }));
            }}
            style={selectStyle}
          >
            {Object.entries(state.ciudades).map(([key, ciudad]) => (
              <option key={key} value={key}>
                {ciudad.emoji} {ciudad.nombre}
              </option>
            ))}
          </select>
        </div>

        <div style={buttonContainerStyle}>
          <button onClick={verTemperatura} style={buttonStyle} className="btn-primary">
            <span style={buttonIconStyle}>🌡️</span>
            Temperatura
          </button>
          <button onClick={verPrecipitaciones} style={buttonStyle} className="btn-secondary">
            <span style={buttonIconStyle}>☔</span>
            Precipitaciones
          </button>
        </div>
      </div>

      <hr style={separadorStyle} />

      {/* Card del Formulario de carga */}
      <div style={cardStyle}>
        <div style={formContainerStyle}>
          <h3 style={formTitleStyle}>Agregar nueva ubicación</h3>
          
          <div style={inputGroupStyle}>
            <input 
              type="text" 
              placeholder="Nombre de la ciudad" 
              value={state.nuevoNombreCiudad}
              onChange={(e) => setState(prev => ({ ...prev, nuevoNombreCiudad: e.target.value }))}
              style={inputStyle}
            />
          </div>

          <div style={inlineInputsStyle}>
            <input 
              type="number" 
              step="any"
              placeholder="Latitud (ej: -54.8)" 
              value={state.nuevaLatitud}
              onChange={(e) => setState(prev => ({ ...prev, nuevaLatitud: e.target.value }))}
              style={inputStyle}
            />
            <input 
              type="number" 
              step="any"
              placeholder="Longitud (ej: -68.3)" 
              value={state.nuevaLongitud}
              onChange={(e) => setState(prev => ({ ...prev, nuevaLongitud: e.target.value }))}
              style={inputStyle}
            />
          </div>

          <button onClick={agregarCiudad} style={addButtonStyle}>
            ➕ Guardar ubicación
          </button>
        </div>
      </div>

      <WeatherModal
        isOpen={state.showModalTemp}
        title={ciudadActual.nombre}
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
        title={ciudadActual.nombre}
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
  /*background: 'linear-gradient(135deg, #f5f7fa 0%, #c3d4e6 100%)',*/
  fontFamily: "'Inter', sans-serif",
  position: 'relative' as const,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column' as const,   
  justifyContent: 'center',
  alignItems: 'center',
};

const bgDecorativeStyle = {
  position: 'fixed' as const,

  width: '800px',
  height: '800px',
  borderRadius: '50%',
  background: 'radial-gradient(circle, rgba(41, 128, 185, 0.6) 0%, transparent 70%)',
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
  color: '#fff',
  marginBottom: '8px',
  letterSpacing: '-1px',
};

const subtitleStyle = {
  fontSize: '16px',
  color: '#d3ebffff',
  fontWeight: 400,
  letterSpacing: '0.5px',
};

const cardStyle = {
  maxWidth: '500px',
  width: '100%', //para mejorar el responsive
  margin: '0 0 40px',
  background: 'rgba(53, 105, 143, 0.75)',
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
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: '16px',
  color: '#000000',
  cursor: 'pointer',
  display: 'flex' as const,
  alignItems: 'center' as const,
  justifyContent: 'center',
  gap: '8px',
  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
  fontFamily: "'Inter', sans-serif",
  backdropFilter: 'blur(10px)',
  position: 'relative' as const,
  overflow: 'hidden' as const,
};

const buttonIconStyle = {
  fontSize: '20px',
 };

const separadorStyle = {
  width: '80%',
  border: '0',
  margin: '30px 0',
  background: 'rgba(255, 255, 255, 0.2)',
};

const formContainerStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '12px',
};

const formTitleStyle = {
  fontSize: '16px',
  fontWeight: 600,
  color: '#ffffff',
  marginBottom: '4px',
};

const inputGroupStyle = {
  width: '100%',
};

const inlineInputsStyle = {
  display: 'flex',
  gap: '12px',
};

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  fontSize: '14px',
  border: '1px solid rgba(255,255,255,0.3)',
  borderRadius: '8px',
  background: 'rgba(255, 255, 255, 0.9)',
  color: '#1a3a52',
  fontFamily: "'Inter', sans-serif",
};

const addButtonStyle = {
  padding: '12px',
  fontSize: '14px',
  fontWeight: 600,
  background: '#2ecc71',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'background 0.2s ease',
  marginTop: '6px',
};

export default App;