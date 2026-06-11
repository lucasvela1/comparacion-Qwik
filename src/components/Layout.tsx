import { Link, useLocation } from 'react-router-dom';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  return (
    <div>
      <nav style={navStyle}>
        <Link to="/" style={linkStyle}>🌤️ Clima TDF</Link>
        <div style={navLinksStyle}>
          <Link 
            to="/" 
            style={location.pathname === '/' ? activeNavStyle : linkStyle}
          >
            Clima
          </Link>
          <Link 
            to="/agregar-ciudad" 
            style={location.pathname === '/agregar-ciudad' ? activeNavStyle : linkStyle}
          >
            + Agregar Ciudad
          </Link>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
};

const navStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px 32px',
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
};

const navLinksStyle = {
  display: 'flex',
  gap: '24px',
};

const linkStyle = {
  color: 'white',
  textDecoration: 'none',
  fontSize: '16px',
  fontWeight: 500,
};

const activeNavStyle = {
  color: 'white',
  textDecoration: 'none',
  fontSize: '16px',
  fontWeight: 600,
  borderBottom: '2px solid white',
  paddingBottom: '4px',
};