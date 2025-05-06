import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingBalloonProps {
  message?: string;
}

const LoadingBalloon: React.FC<LoadingBalloonProps> = ({ message = "CARREGANDO" }) => {
  const [isPopped, setIsPopped] = useState(false);
  const [cycle, setCycle] = useState(0);
  
  // Cores para os balões
  const balloonColors = ['#ff00a0', '#00ff8c', '#9d00ff', '#00d9ff'];
  
  useEffect(() => {
    // Controla o ciclo de vida do balão (encher -> estourar -> reiniciar)
    const inflateDuration = 2000; // 2 segundos para encher
    
    // Quando ciclo inicia, resetamos o estado de explosão
    setIsPopped(false);
    
    // Timer para "estourar" o balão
    const popTimer = setTimeout(() => {
      setIsPopped(true);
      
      // Timer para iniciar um novo ciclo
      const nextCycleTimer = setTimeout(() => {
        setCycle(prev => prev + 1);
      }, 500); // Esperar 500ms após estourar para iniciar o próximo
      
      return () => clearTimeout(nextCycleTimer);
    }, inflateDuration);
    
    return () => clearTimeout(popTimer);
  }, [cycle]);
  
  // Seleciona uma cor baseada no ciclo atual
  const currentColor = balloonColors[cycle % balloonColors.length];
  
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <AnimatePresence mode="wait">
        {!isPopped ? (
          // Balão enchendo
          <motion.div
            key="inflating"
            initial={{ scale: 0.1, opacity: 0.7 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              rotate: [0, 5, -5, 3, -3, 0]
            }}
            exit={{ 
              scale: 1.5, 
              opacity: 0,
              transition: { duration: 0.2 }
            }}
            transition={{ 
              duration: 2,
              rotate: {
                repeat: Infinity,
                duration: 2
              }
            }}
            className="relative mb-6"
          >
            {/* Corpo do balão */}
            <svg width="120" height="150" viewBox="0 0 120 150" className="drop-shadow-glow">
              {/* String do balão */}
              <path 
                d="M60 120 Q55 135 65 145" 
                stroke="#333" 
                strokeWidth="2" 
                fill="none" 
              />
              
              {/* Corpo principal do balão */}
              <ellipse 
                cx="60" 
                cy="60" 
                rx="50" 
                ry="60" 
                fill={currentColor} 
              />
              
              {/* Reflexo do balão */}
              <ellipse 
                cx="45" 
                cy="45" 
                rx="15" 
                ry="20" 
                fill="rgba(255, 255, 255, 0.3)" 
              />
            </svg>
          </motion.div>
        ) : (
          // Animação de explosão
          <motion.div
            key="popping"
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.3 }}
            className="relative mb-6"
          >
            {/* Fragmentos da explosão */}
            <motion.div className="absolute inset-0 flex items-center justify-center">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ x: 0, y: 0, opacity: 1 }}
                  animate={{ 
                    x: Math.sin(i * Math.PI / 4) * 80,
                    y: Math.cos(i * Math.PI / 4) * 80,
                    opacity: 0
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute w-4 h-4"
                  style={{ 
                    backgroundColor: currentColor,
                    borderRadius: '50%'
                  }}
                />
              ))}
              
              {/* Onomatopeia de explosão */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="text-4xl font-bold text-primary"
              >
                POP!
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Mensagem de carregamento */}
      <motion.div 
        animate={{ opacity: [0.5, 1, 0.5] }} 
        transition={{ 
          repeat: Infinity, 
          duration: 1.5 
        }}
        className="mt-4 text-primary font-fira text-center"
      >
        {message}
        <motion.span
          animate={{ opacity: [0, 0, 1, 0] }}
          transition={{ 
            repeat: Infinity, 
            duration: 1.5,
            times: [0, 0.3, 0.5, 1] 
          }}
        >
          _
        </motion.span>
      </motion.div>
    </div>
  );
};

export default LoadingBalloon;