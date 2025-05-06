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
    <span key={i} className="line-fragment">
      {line}
      {i < text.split('\n').length - 1 && (
        <>
          <br />
          <br />
        </>
      )}
    </span>
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
            {/* Background shape with white stroke */}
            <path 
              d="M50 50 L350 50 L300 350 L100 350 Z" 
              fill="#2b1c6b" 
              stroke="white" 
              strokeWidth="4"
            />
              
            {/* Binary code backdrop - more extensive */}
            <g className="binary-code" opacity="0.7">
              <text x="70" y="90" fill="#00FF8C" fontSize="14">01001001</text>
              <text x="150" y="110" fill="#00FF8C" fontSize="14">1100101</text>
              <text x="90" y="130" fill="#00FF8C" fontSize="14">01011001</text>
              <text x="180" y="150" fill="#00FF8C" fontSize="14">10110</text>
              <text x="70" y="170" fill="#00FF8C" fontSize="14">10010110</text>
              <text x="140" y="190" fill="#00FF8C" fontSize="14">01101</text>
              <text x="120" y="210" fill="#00FF8C" fontSize="14">001011</text>
              <text x="70" y="230" fill="#00FF8C" fontSize="14">11001010</text>
              <text x="160" y="250" fill="#00FF8C" fontSize="14">01001</text>
              <text x="100" y="270" fill="#00FF8C" fontSize="14">10110010</text>
              <text x="190" y="290" fill="#00FF8C" fontSize="14">10100</text>
              <text x="80" y="310" fill="#00FF8C" fontSize="14">01100101</text>
              
              {/* Additional binary code */}
              <text x="250" y="80" fill="#00FF8C" fontSize="14">101011</text>
              <text x="270" y="100" fill="#00FF8C" fontSize="14">0010</text>
              <text x="290" y="120" fill="#00FF8C" fontSize="14">111010</text>
              <text x="260" y="140" fill="#00FF8C" fontSize="14">10001</text>
              <text x="280" y="160" fill="#00FF8C" fontSize="14">01010</text>
              <text x="270" y="180" fill="#00FF8C" fontSize="14">110101</text>
              <text x="290" y="200" fill="#00FF8C" fontSize="14">0011</text>
              <text x="255" y="220" fill="#00FF8C" fontSize="14">10101</text>
              <text x="275" y="240" fill="#00FF8C" fontSize="14">11100</text>
              <text x="250" y="260" fill="#00FF8C" fontSize="14">010101</text>
              <text x="280" y="280" fill="#00FF8C" fontSize="14">1001</text>
              <text x="260" y="300" fill="#00FF8C" fontSize="14">101010</text>
              
              {/* Left side additional code */}
              <text x="60" y="100" fill="#00FF8C" fontSize="14">101</text>
              <text x="50" y="120" fill="#00FF8C" fontSize="14">0110</text>
              <text x="60" y="140" fill="#00FF8C" fontSize="14">1011</text>
              <text x="55" y="160" fill="#00FF8C" fontSize="14">01</text>
              <text x="60" y="180" fill="#00FF8C" fontSize="14">110</text>
              <text x="50" y="200" fill="#00FF8C" fontSize="14">1010</text>
              <text x="55" y="220" fill="#00FF8C" fontSize="14">01</text>
              <text x="60" y="240" fill="#00FF8C" fontSize="14">10</text>
              <text x="55" y="260" fill="#00FF8C" fontSize="14">011</text>
              <text x="60" y="280" fill="#00FF8C" fontSize="14">10</text>
              <text x="55" y="300" fill="#00FF8C" fontSize="14">01</text>
              <text x="60" y="320" fill="#00FF8C" fontSize="14">11</text>
            </g>
              
            {/* Emblem/Avatar area */}
            <path 
              d="M150 100 L250 100 L270 250 L130 250 Z" 
              fill="#200a4c" 
              stroke="white" 
              strokeWidth="2"
            />
              
            {/* Wizard hat with more detail */}
            <path 
              d="M130 140 L200 80 L270 140" 
              fill="#33095e" 
              stroke="white" 
              strokeWidth="2"
            />
            {/* Hat details */}
            <path 
              d="M150 130 L200 90 L250 130" 
              stroke="#FF9D00" 
              strokeWidth="2"
              fill="none"
            />
            <path 
              d="M185 95 C195 85, 205 85, 215 95" 
              stroke="#FF9D00" 
              strokeWidth="2"
              fill="none"
            />
              
            {/* Character face outline */}
            <circle 
              cx="200" 
              cy="160" 
              r="45" 
              fill="#e9c8a7" 
              stroke="#33095e" 
              strokeWidth="2"
            />
              
            {/* Hair elements */}
            <path 
              d="M160 130 C170 120, 190 115, 200 120" 
              stroke="white" 
              strokeWidth="4"
              fill="none"
            />
            <path 
              d="M240 130 C230 120, 210 115, 200 120" 
              stroke="white" 
              strokeWidth="4"
              fill="none"
            />
              
            {/* Eyes - more intense, focused look */}
            <ellipse cx="180" cy="155" rx="8" ry="5" fill="#33095e" />
            <ellipse cx="220" cy="155" rx="8" ry="5" fill="#33095e" />
            <circle cx="183" cy="153" r="2" fill="white" />
            <circle cx="223" cy="153" r="2" fill="white" />
            
            {/* Eyebrows - more angular, focused appearance */}
            <path 
              d="M170 145 L190 140" 
              stroke="#33095e" 
              strokeWidth="3"
              fill="none"
            />
            <path 
              d="M210 140 L230 145" 
              stroke="#33095e" 
              strokeWidth="3"
              fill="none"
            />
              
            {/* Mouth - serious expression */}
            <path 
              d="M185 175 L215 175" 
              stroke="#33095e" 
              strokeWidth="2"
              fill="none"
            />
            <path 
              d="M180 180 L220 180" 
              stroke="#33095e" 
              strokeWidth="1"
              fill="none"
              opacity="0.5"
            />
              
            {/* Hand holding code panel - similar to UFES mascot */}
            <path 
              d="M170 190 V220 A20 20 0 0 0 190 240 H210 A20 20 0 0 0 230 220 V190" 
              fill="#e9c8a7" 
              stroke="#33095e" 
              strokeWidth="2"
            />
            
            {/* Code panel */}
            <rect 
              x="155" 
              y="190" 
              width="90" 
              height="60" 
              rx="3" 
              fill="#00FF8C" 
              opacity="0.4"
              stroke="#33095e"
              strokeWidth="1"
            />
            
            {/* Code on panel */}
            <text x="165" y="210" fill="#33095e" fontSize="11" fontWeight="bold">01001011</text>
            <text x="170" y="225" fill="#33095e" fontSize="11" fontWeight="bold">10110100</text>
            <text x="165" y="240" fill="#33095e" fontSize="11" fontWeight="bold">01001101</text>
            
            {/* Fingers holding code */}
            <path 
              d="M160 220 V230 A5 5 0 0 0 165 235" 
              fill="none" 
              stroke="#33095e" 
              strokeWidth="2"
            />
            <path 
              d="M240 220 V230 A5 5 0 0 1 235 235" 
              fill="none" 
              stroke="#33095e" 
              strokeWidth="2"
            />
              
            {/* Binary floating elements */}
            <text x="140" y="170" fill="#FF9D00" fontSize="18" fontWeight="bold">1</text>
            <text x="250" y="170" fill="#FF9D00" fontSize="18" fontWeight="bold">0</text>
            <text x="180" y="135" fill="#FF9D00" fontSize="18" fontWeight="bold">1</text>
            <text x="220" y="135" fill="#FF9D00" fontSize="18" fontWeight="bold">0</text>
            
            {/* Title */}
            <text 
              x="200" 
              y="300" 
              fill="white" 
              fontSize="22" 
              fontWeight="bold" 
              textAnchor="middle" 
              fontFamily="monospace"
            >
              CODE WIZARD
            </text>
            
            {/* Decorative elements */}
            <circle cx="310" cy="90" r="15" fill="#00D9FF" opacity="0.6" />
            <circle cx="90" cy="90" r="15" fill="#9D00FF" opacity="0.6" />
            <circle cx="310" cy="310" r="15" fill="#00FF8C" opacity="0.6" />
            <circle cx="90" cy="310" r="15" fill="#FF9D00" opacity="0.6" />
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
