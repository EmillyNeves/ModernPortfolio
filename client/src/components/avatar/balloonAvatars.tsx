import React from 'react';

export interface BalloonAvatarProps {
  color: string;
  detailColor: string;
  pattern: string;
  shape: string;
  decoration: string;
  accessories: string[];
  size?: 'sm' | 'md' | 'lg' | 'xl';
  expression?: 'happy' | 'tired';
  className?: string;
}

const BalloonAvatar: React.FC<BalloonAvatarProps> = ({
  color = '#FF6699',
  detailColor = '#4466FF',
  pattern = 'dots',
  shape = 'round',
  decoration = 'none',
  accessories = [],
  size = 'md',
  expression = 'happy',
  className = '',
}) => {
  // Define size values based on the size prop
  const dimensions = {
    sm: { width: 60, height: 60 },
    md: { width: 100, height: 100 },
    lg: { width: 150, height: 150 },
    xl: { width: 200, height: 200 },
  };

  const { width, height } = dimensions[size];
  
  // Base balloon shapes
  const renderShape = () => {
    switch (shape) {
      case 'round':
        return <circle cx="50" cy="40" r="30" fill={color} />;
      case 'oval':
        return <ellipse cx="50" cy="40" rx="20" ry="35" fill={color} />;
      case 'square':
        return <rect x="25" y="15" width="50" height="50" rx="10" fill={color} />;
      default:
        return <circle cx="50" cy="40" r="30" fill={color} />;
    }
  };

  // Balloon string
  const renderString = () => {
    const yOffset = shape === 'round' ? 70 : shape === 'oval' ? 75 : 65;
    return (
      <path 
        d={`M50 ${yOffset} Q45 85 55 95`} 
        stroke={detailColor} 
        strokeWidth="1.5" 
        fill="none" 
      />
    );
  };

  // Patterns
  const renderPattern = () => {
    switch (pattern) {
      case 'dots':
        return (
          <>
            <circle cx="40" cy="30" r="3" fill={detailColor} />
            <circle cx="60" cy="30" r="3" fill={detailColor} />
            <circle cx="40" cy="50" r="3" fill={detailColor} />
            <circle cx="60" cy="50" r="3" fill={detailColor} />
            <circle cx="50" cy="40" r="3" fill={detailColor} />
          </>
        );
      case 'stripes':
        return (
          <>
            <path d="M30 30 L70 30" stroke={detailColor} strokeWidth="3" />
            <path d="M30 40 L70 40" stroke={detailColor} strokeWidth="3" />
            <path d="M30 50 L70 50" stroke={detailColor} strokeWidth="3" />
          </>
        );
      case 'spiral':
        return (
          <path d="M50 25 C60 30 60 40 50 45 C40 50 40 60 50 65" stroke={detailColor} strokeWidth="2" fill="none" />
        );
      case 'stars':
        return (
          <>
            <path d="M40 30 L42 25 L44 30 L39 27 L45 27 Z" fill={detailColor} />
            <path d="M60 30 L62 25 L64 30 L59 27 L65 27 Z" fill={detailColor} />
            <path d="M40 50 L42 45 L44 50 L39 47 L45 47 Z" fill={detailColor} />
            <path d="M60 50 L62 45 L64 50 L59 47 L65 47 Z" fill={detailColor} />
          </>
        );
      default:
        return null;
    }
  };

  // Decorations (external elements)
  const renderDecoration = () => {
    switch (decoration) {
      case 'ribbons':
        return (
          <>
            <path d="M20 40 L25 40" stroke="#000066" strokeWidth="2" />
            <path d="M75 40 L80 40" stroke="#000066" strokeWidth="2" />
            <path d="M50 10 L50 15" stroke="#000066" strokeWidth="2" />
          </>
        );
      case 'bows':
        return (
          <>
            <path d="M50 10 C60 20 70 20 80 30" stroke="#3366cc" strokeWidth="1.5" fill="none" />
            <path d="M50 10 C40 20 30 20 20 30" stroke="#3366cc" strokeWidth="1.5" fill="none" />
          </>
        );
      case 'confetti':
        return (
          <>
            <circle cx="50" cy="10" r="5" fill="#cc3333" />
            <path d="M45 10 L35 5" stroke="#cc3333" strokeWidth="1" />
            <path d="M55 10 L65 5" stroke="#cc3333" strokeWidth="1" />
          </>
        );
      case 'initials':
        return (
          <text x="50" y="40" fontSize="10" fill={detailColor} textAnchor="middle">ME</text>
        );
      case 'neon':
        return (
          <>
            <path d="M25 40 L20 30 L25 20 L20 10" stroke="#00ffff" strokeWidth="1" />
            <path d="M75 40 L80 30 L75 20 L80 10" stroke="#ff00ff" strokeWidth="1" />
          </>
        );
      default:
        return null;
    }
  };

  // Accessories
  const renderAccessories = () => {
    return (
      <>
        {accessories.includes('glasses') && (
          <>
            <circle cx="40" cy="35" r="5" fill="none" stroke="#000000" strokeWidth="1" />
            <circle cx="60" cy="35" r="5" fill="none" stroke="#000000" strokeWidth="1" />
            <line x1="45" y1="35" x2="55" y2="35" stroke="#000000" strokeWidth="1" />
          </>
        )}
        
        {accessories.includes('hat') && (
          <path d="M30 20 L70 20 L50 5 Z" fill="#444444" />
        )}
        
        {accessories.includes('earrings') && (
          <>
            <circle cx="20" cy="40" r="3" fill="#ffcc00" />
            <circle cx="80" cy="40" r="3" fill="#ffcc00" />
          </>
        )}
        
        {accessories.includes('necklace') && (
          <path d="M35 60 Q50 65 65 60" stroke="#ffcc00" strokeWidth="1.5" fill="none" />
        )}
        
        {accessories.includes('watch') && (
          <rect x="20" y="55" width="5" height="8" fill="#333333" />
        )}
      </>
    );
  };

  // Face features
  const renderFace = () => {
    if (expression === 'tired') {
      return (
        <>
          {/* Olhos com olheiras para expressão cansada */}
          <circle cx="40" cy="35" r="2" fill="black" />
          <circle cx="60" cy="35" r="2" fill="black" />
          
          {/* Olheiras */}
          <path d="M35 38 Q40 41 45 38" stroke="#553366" strokeWidth="1" fill="none" opacity="0.5" />
          <path d="M55 38 Q60 41 65 38" stroke="#553366" strokeWidth="1" fill="none" opacity="0.5" />
          
          {/* Boca séria/cansada */}
          <path d="M45 48 L55 48" stroke="black" strokeWidth="1.5" fill="none" />
          
          {/* Sobrancelhas inclinadas para expressão cansada */}
          <path d="M35 30 L45 32" stroke="black" strokeWidth="1.5" fill="none" />
          <path d="M55 32 L65 30" stroke="black" strokeWidth="1.5" fill="none" />
        </>
      );
    } else {
      // Expressão feliz/fofa padrão para calouro
      return (
        <>
          {/* Olhos sorridentes */}
          <circle cx="40" cy="35" r="2.5" fill="black" />
          <circle cx="60" cy="35" r="2.5" fill="black" />
          
          {/* Reflexo nos olhos */}
          <circle cx="41" cy="34" r="1" fill="white" />
          <circle cx="61" cy="34" r="1" fill="white" />
          
          {/* Bochechas coradas */}
          <circle cx="35" cy="40" r="3" fill="#FF9999" opacity="0.5" />
          <circle cx="65" cy="40" r="3" fill="#FF9999" opacity="0.5" />
          
          {/* Sorriso fofo */}
          <path d="M45 45 Q50 50 55 45" stroke="black" strokeWidth="1.5" fill="none" />
        </>
      );
    }
  };

  return (
    <svg 
      viewBox="0 0 100 100" 
      width={width} 
      height={height} 
      className={className}
    >
      {renderShape()}
      {renderString()}
      {renderPattern()}
      {renderDecoration()}
      {renderAccessories()}
      {renderFace()}
    </svg>
  );
};

export default BalloonAvatar;