import React, { ReactNode}  from 'react';

interface RainBgProps {
  children?: ReactNode; 
}

const RainBackground: React.FC<RainBgProps> = ({ children }) => {
  return (
    <div className="rain-bg" style={{ position: 'relative', overflow: 'hidden' }}>
      {children}
    </div>
  );
};

export default RainBackground;