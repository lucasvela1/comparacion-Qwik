import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Clima } from './pages/Clima';
import { AgregarCiudad } from './pages/AgregarCiudad';
import './index.css';
import RainBackground from './components/RainBackground';

function App() {
  return (
    <RainBackground> 
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Clima />} />
            <Route path="/agregar-ciudad" element={<AgregarCiudad />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </RainBackground>
  );
}

export default App;