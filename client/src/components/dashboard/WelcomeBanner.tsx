import React, { useState, useEffect } from "react";

const WelcomeBanner: React.FC = () => {
  const [text, setText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  
  const fullText = `Transforme sua jornada acadêmica em uma experiência dinâmica e interativa.

Uma plataforma gamificada que monitora seus dados acadêmicos, visualiza conquistas e requisitos.

Complete desafios, acumule XP, suba de nível e desbloqueie novas habilidades.`;

  useEffect(() => {
    let index = 0;
    let timeoutId: NodeJS.Timeout;
    
    const type = () => {
      setText(fullText.substring(0, index));
      index++;
      
      if (index <= fullText.length) {
        timeoutId = setTimeout(type, 20);
      } else {
        setIsTypingComplete(true);
      }
    };
    
    // Start typing after a short delay
    const startTimeout = setTimeout(type, 500);
    
    // Cleanup
    return () => {
      clearTimeout(startTimeout);
      clearTimeout(timeoutId);
    };
  }, []);

  // Transformando as quebras de linha em <br /> para React
  const formattedText = text.split('\n').map((line, i) => (
    <React.Fragment key={i}>
      {line}
      {i < text.split('\n').length - 1 && <br key={`br-${i}`} />}
      {i < text.split('\n').length - 1 && <br key={`br2-${i}`} />}
    </React.Fragment>
  ));

  return (
    <div className="relative">
      <div className="terminal-window bg-background/80 rounded-lg overflow-hidden">
        <div className="absolute top-0 right-0 mt-6 mr-6 lg:mt-8 lg:mr-8 z-10 max-w-[280px] transform rotate-3">
          <svg
            width="280"
            height="280"
            viewBox="0 0 400 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
          >
            <rect width="300" height="200" x="50" y="120" rx="10" fill="#333" />
            <rect width="260" height="160" x="70" y="140" rx="5" fill="#111" />
            <rect width="60" height="100" x="290" y="60" fill="#444" />
            <rect width="200" height="30" x="100" y="90" rx="5" fill="#555" />
            <rect width="40" height="10" x="160" y="330" rx="2" fill="#555" />
            <rect width="100" height="10" x="130" y="350" rx="2" fill="#222" />
            <rect width="10" height="10" x="150" y="330" rx="2" fill="#00ff8c" />
            <rect width="150" height="40" x="90" y="40" rx="5" fill="#444" />
            <path
              d="M70 180 L100 180 L85 200 Z"
              fill="#00D9FF"
            />
            <path
              d="M120 180 L150 180 L135 200 Z"
              fill="#9D00FF"
            />
            <path
              d="M170 180 L200 180 L185 200 Z"
              fill="#00FF8C"
            />
            <rect width="30" height="3" x="80" y="220" rx="1" fill="#666" />
            <rect width="30" height="3" x="120" y="220" rx="1" fill="#666" />
            <rect width="30" height="3" x="160" y="220" rx="1" fill="#666" />
            <rect width="30" height="3" x="200" y="220" rx="1" fill="#666" />
            <rect width="30" height="3" x="240" y="220" rx="1" fill="#666" />
            <rect width="30" height="3" x="80" y="230" rx="1" fill="#666" />
            <rect width="30" height="3" x="120" y="230" rx="1" fill="#666" />
            <rect width="30" height="3" x="160" y="230" rx="1" fill="#666" />
            <rect width="30" height="3" x="200" y="230" rx="1" fill="#666" />
            <rect width="30" height="3" x="240" y="230" rx="1" fill="#666" />
            <rect width="30" height="3" x="80" y="240" rx="1" fill="#666" />
            <rect width="30" height="3" x="120" y="240" rx="1" fill="#666" />
            <rect width="30" height="3" x="160" y="240" rx="1" fill="#666" />
            <rect width="30" height="3" x="200" y="240" rx="1" fill="#666" />
            <rect width="30" height="3" x="240" y="240" rx="1" fill="#666" />
          </svg>
        </div>

        <div className="p-8 lg:p-12 relative z-0">
          <h1 className="font-orbitron text-4xl sm:text-5xl lg:text-6xl font-bold mb-2 text-primary glitch-effect tracking-wider">
            GRAD
            <br />
            NAVIGATOR
          </h1>
          <p className="font-fira text-white/80 max-w-md mt-6 text-sm hacking-text formatted-text">
            {formattedText}
            {!isTypingComplete && <span className="animate-pulse">|</span>}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;
