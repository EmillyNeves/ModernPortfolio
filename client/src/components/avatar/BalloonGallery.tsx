import React from 'react';
import BalloonAvatar from './balloonAvatars';

// Interface para o componente BalloonGallery
interface BalloonGalleryProps {
  className?: string;
}

// Componente que exibe uma galeria de avatares de balão com diferentes configurações
const BalloonGallery: React.FC<BalloonGalleryProps> = ({ className = '' }) => {
  // Cores para os balões
  const balloonColors = [
    '#FF6699', // Rosa
    '#66CCFF', // Azul claro
    '#FFCC33', // Amarelo
    '#99FF66', // Verde claro
    '#CC99FF', // Lilás
    '#FF9966', // Laranja
  ];

  // Cores para os detalhes
  const detailColors = [
    '#FFFFFF', // Branco
    '#333333', // Cinza escuro
    '#FF3366', // Vermelho
    '#3366FF', // Azul
    '#33CC66', // Verde
    '#9933FF', // Roxo
  ];

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 ${className}`}>
      {/* Balões com diferentes formas */}
      <div className="flex flex-col items-center">
        <BalloonAvatar 
          color={balloonColors[0]} 
          detailColor={detailColors[0]} 
          pattern="dots" 
          shape="round" 
          decoration="none" 
          accessories={[]} 
          size="md"
        />
        <span className="text-xs mt-2">Redondo</span>
      </div>
      
      <div className="flex flex-col items-center">
        <BalloonAvatar 
          color={balloonColors[1]} 
          detailColor={detailColors[1]} 
          pattern="dots" 
          shape="oval" 
          decoration="none" 
          accessories={[]} 
          size="md"
        />
        <span className="text-xs mt-2">Oval</span>
      </div>
      
      <div className="flex flex-col items-center">
        <BalloonAvatar 
          color={balloonColors[2]} 
          detailColor={detailColors[2]} 
          pattern="dots" 
          shape="square" 
          decoration="none" 
          accessories={[]} 
          size="md"
        />
        <span className="text-xs mt-2">Quadrado</span>
      </div>
      
      {/* Balões com diferentes padrões */}
      <div className="flex flex-col items-center">
        <BalloonAvatar 
          color={balloonColors[3]} 
          detailColor={detailColors[3]} 
          pattern="dots" 
          shape="round" 
          decoration="none" 
          accessories={[]} 
          size="md"
        />
        <span className="text-xs mt-2">Bolinhas</span>
      </div>
      
      <div className="flex flex-col items-center">
        <BalloonAvatar 
          color={balloonColors[4]} 
          detailColor={detailColors[4]} 
          pattern="stripes" 
          shape="round" 
          decoration="none" 
          accessories={[]} 
          size="md"
        />
        <span className="text-xs mt-2">Listras</span>
      </div>
      
      <div className="flex flex-col items-center">
        <BalloonAvatar 
          color={balloonColors[5]} 
          detailColor={detailColors[5]} 
          pattern="spiral" 
          shape="round" 
          decoration="none" 
          accessories={[]} 
          size="md"
        />
        <span className="text-xs mt-2">Espiral</span>
      </div>
      
      <div className="flex flex-col items-center">
        <BalloonAvatar 
          color={balloonColors[0]} 
          detailColor={detailColors[5]} 
          pattern="stars" 
          shape="round" 
          decoration="none" 
          accessories={[]} 
          size="md"
        />
        <span className="text-xs mt-2">Estrelas</span>
      </div>
      
      {/* Balões com diferentes decorações */}
      <div className="flex flex-col items-center">
        <BalloonAvatar 
          color={balloonColors[1]} 
          detailColor={detailColors[0]} 
          pattern="dots" 
          shape="round" 
          decoration="ribbons" 
          accessories={[]} 
          size="md"
        />
        <span className="text-xs mt-2">Fitas</span>
      </div>
      
      <div className="flex flex-col items-center">
        <BalloonAvatar 
          color={balloonColors[2]} 
          detailColor={detailColors[1]} 
          pattern="dots" 
          shape="round" 
          decoration="bows" 
          accessories={[]} 
          size="md"
        />
        <span className="text-xs mt-2">Laços</span>
      </div>
      
      <div className="flex flex-col items-center">
        <BalloonAvatar 
          color={balloonColors[3]} 
          detailColor={detailColors[2]} 
          pattern="dots" 
          shape="round" 
          decoration="confetti" 
          accessories={[]} 
          size="md"
        />
        <span className="text-xs mt-2">Confete</span>
      </div>
      
      {/* Balões com acessórios */}
      <div className="flex flex-col items-center">
        <BalloonAvatar 
          color={balloonColors[4]} 
          detailColor={detailColors[3]} 
          pattern="dots" 
          shape="round" 
          decoration="none" 
          accessories={['glasses']} 
          size="md"
        />
        <span className="text-xs mt-2">Óculos</span>
      </div>
      
      <div className="flex flex-col items-center">
        <BalloonAvatar 
          color={balloonColors[5]} 
          detailColor={detailColors[4]} 
          pattern="dots" 
          shape="round" 
          decoration="none" 
          accessories={['hat']} 
          size="md"
        />
        <span className="text-xs mt-2">Chapéu</span>
      </div>
      
      {/* Balão personalizado (combinação de vários elementos) */}
      <div className="flex flex-col items-center">
        <BalloonAvatar 
          color="#FF6699" 
          detailColor="#FFFFFF" 
          pattern="stars" 
          shape="round" 
          decoration="neon" 
          accessories={['glasses', 'hat']} 
          size="md"
        />
        <span className="text-xs mt-2">Personalizado</span>
      </div>
    </div>
  );
};

export default BalloonGallery;