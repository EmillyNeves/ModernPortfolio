import React from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@shared/schema";
import { AvatarConfig } from "./AvatarEditor";
import BalloonAvatar from "./balloonAvatars";
import type { BalloonAvatarProps } from "./balloonAvatars";

interface AnimatedAvatarProps {
  user: User;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showAnimation?: boolean;
}

const AnimatedAvatar: React.FC<AnimatedAvatarProps> = ({ 
  user, 
  className = "", 
  size = "md",
  showAnimation = true 
}) => {
  // Size classes
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-24 h-24",
    xl: "w-32 h-32"
  };

  // Animation variants for the avatar
  const avatarAnimations = {
    idle: {
      y: [0, -5, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    walk: {
      x: [-5, 5, -5],
      transition: {
        duration: 0.5,
        repeat: Infinity
      }
    },
    run: {
      x: [-10, 10, -10],
      transition: {
        duration: 0.3,
        repeat: Infinity
      }
    },
    thinking: {
      rotate: [0, 5, 0, -5, 0],
      transition: {
        duration: 2,
        repeat: Infinity
      }
    },
    studying: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity
      }
    },
    celebrating: {
      y: [0, -20, 0],
      rotate: [0, 10, 0, -10, 0],
      transition: {
        duration: 0.8,
        repeat: Infinity
      }
    }
  };

  // Parse avatar config if it exists
  let avatarConfig: AvatarConfig | null = null;
  let animation = "idle";

  if (user.avatarConfig) {
    try {
      avatarConfig = JSON.parse(user.avatarConfig as string) as AvatarConfig;
      animation = avatarConfig.animation;
    } catch (e) {
      console.error("Failed to parse avatar config", e);
    }
  }

  // Generate avatar SVG based on config
  const generateAvatarSVG = () => {
    if (!avatarConfig) {
      // Default avatar if no config
      return '';
    }
    
    // Encode colors for SVG URL
    const encodeColor = (color: string) => color.replace(/#/g, '%23');
    const skinTone = encodeColor(avatarConfig.skinTone);
    const hairColor = encodeColor(avatarConfig.hairColor);
    
    // Body shape based on body type
    const bodyShape = avatarConfig.bodyType === 'athletic' ? 
      "balloon-round" : 
      avatarConfig.bodyType === 'slim' ? 
      "balloon-long" : 
      "balloon-square";
    
    // Determine balloon shape and string
    let balloonPath = '';
    let stringPath = '';
    
    switch (bodyShape) {
      case 'balloon-round':
        balloonPath = `<circle cx="50" cy="40" r="30" fill="${skinTone}" />`;
        stringPath = `<path d="M50 70 Q45 85 55 95" stroke="${hairColor}" stroke-width="1.5" fill="none" />`;
        break;
      case 'balloon-long':
        balloonPath = `<ellipse cx="50" cy="40" rx="20" ry="35" fill="${skinTone}" />`;
        stringPath = `<path d="M50 75 Q45 85 55 95" stroke="${hairColor}" stroke-width="1.5" fill="none" />`;
        break;
      case 'balloon-square':
        balloonPath = `<rect x="25" y="15" width="50" height="50" rx="10" fill="${skinTone}" />`;
        stringPath = `<path d="M50 65 Q45 80 55 95" stroke="${hairColor}" stroke-width="1.5" fill="none" />`;
        break;
    }
    
    // Balloon decorations (replaces hair style)
    let decorations = '';
    switch(avatarConfig.hairStyle) {
      case 'short': // Dots pattern
        decorations = `
          <circle cx="40" cy="30" r="3" fill="${hairColor}" />
          <circle cx="60" cy="30" r="3" fill="${hairColor}" />
          <circle cx="40" cy="50" r="3" fill="${hairColor}" />
          <circle cx="60" cy="50" r="3" fill="${hairColor}" />
          <circle cx="50" cy="40" r="3" fill="${hairColor}" />
        `;
        break;
      case 'long': // Stripes pattern
        decorations = `
          <path d="M30 30 L70 30" stroke="${hairColor}" stroke-width="3" />
          <path d="M30 40 L70 40" stroke="${hairColor}" stroke-width="3" />
          <path d="M30 50 L70 50" stroke="${hairColor}" stroke-width="3" />
        `;
        break;
      case 'curly': // Spiral pattern
        decorations = `
          <path d="M50 25 C60 30 60 40 50 45 C40 50 40 60 50 65" stroke="${hairColor}" stroke-width="2" fill="none" />
        `;
        break;
      case 'afro': // Stars pattern
        decorations = `
          <path d="M40 30 L42 25 L44 30 L39 27 L45 27 Z" fill="${hairColor}" />
          <path d="M60 30 L62 25 L64 30 L59 27 L65 27 Z" fill="${hairColor}" />
          <path d="M40 50 L42 45 L44 50 L39 47 L45 47 Z" fill="${hairColor}" />
          <path d="M60 50 L62 45 L64 50 L59 47 L65 47 Z" fill="${hairColor}" />
        `;
        break;
      case 'bald': // No decoration
        decorations = '';
        break;
    }
    
    // Outfit - decorative elements around the balloon
    let outfit = '';
    switch(avatarConfig.outfit) {
      case 'formal':
        outfit = `
          <path d="M20 40 L25 40" stroke="#000066" stroke-width="2" />
          <path d="M75 40 L80 40" stroke="#000066" stroke-width="2" />
          <path d="M50 10 L50 15" stroke="#000066" stroke-width="2" />
        `;
        break;
      case 'casual':
        outfit = `
          <path d="M50 10 C60 20 70 20 80 30" stroke="#3366cc" stroke-width="1.5" fill="none" />
          <path d="M50 10 C40 20 30 20 20 30" stroke="#3366cc" stroke-width="1.5" fill="none" />
        `;
        break;
      case 'sporty':
        outfit = `
          <circle cx="50" cy="10" r="5" fill="#cc3333" />
          <path d="M45 10 L35 5" stroke="#cc3333" stroke-width="1" />
          <path d="M55 10 L65 5" stroke="#cc3333" stroke-width="1" />
        `;
        break;
      case 'geek':
        outfit = `
          <text x="50" y="40" font-size="10" fill="${hairColor}" text-anchor="middle">${user.username.substring(0, 2)}</text>
        `;
        break;
      case 'cyberpunk':
        outfit = `
          <path d="M25 40 L20 30 L25 20 L20 10" stroke="#00ffff" stroke-width="1" />
          <path d="M75 40 L80 30 L75 20 L80 10" stroke="#ff00ff" stroke-width="1" />
        `;
        break;
    }
    
    // Accessories - decorative elements on the balloon
    let accessories = '';
    
    if (avatarConfig.accessories.includes('glasses')) {
      accessories += `
        <circle cx="40" cy="35" r="5" fill="none" stroke="#000000" stroke-width="1" />
        <circle cx="60" cy="35" r="5" fill="none" stroke="#000000" stroke-width="1" />
        <line x1="45" y1="35" x2="55" y2="35" stroke="#000000" stroke-width="1" />
      `;
    }
    
    if (avatarConfig.accessories.includes('hat')) {
      accessories += `
        <path d="M30 20 L70 20 L50 5 Z" fill="#444444" />
      `;
    }
    
    if (avatarConfig.accessories.includes('earrings')) {
      accessories += `
        <circle cx="20" cy="40" r="3" fill="#ffcc00" />
        <circle cx="80" cy="40" r="3" fill="#ffcc00" />
      `;
    }
    
    if (avatarConfig.accessories.includes('necklace')) {
      accessories += `
        <path d="M35 60 Q50 65 65 60" stroke="#ffcc00" stroke-width="1.5" fill="none" />
      `;
    }
    
    if (avatarConfig.accessories.includes('watch')) {
      accessories += `
        <rect x="20" y="55" width="5" height="8" fill="#333333" />
      `;
    }
    
    // Face features
    const face = `
      <circle cx="40" cy="35" r="2" fill="black" />
      <circle cx="60" cy="35" r="2" fill="black" />
      <path d="M45 45 Q50 50 55 45" stroke="black" stroke-width="1.5" fill="none" />
    `;
    
    // Combine all parts
    const svg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <rect width="100" height="100" fill="none" />
      ${balloonPath}
      ${stringPath}
      ${decorations}
      ${outfit}
      ${accessories}
      ${face}
    </svg>`;
    
    return svg;
  };

  // Function to map avatarConfig properties to BalloonAvatar props
  const mapConfigToBalloonProps = () => {
    if (!avatarConfig) return null;
    
    // Map body type to shape
    const shapeMap = {
      'athletic': 'round',
      'slim': 'oval',
      'average': 'square'
    };
    
    // Map hair style to pattern
    const patternMap = {
      'short': 'dots',
      'long': 'stripes',
      'curly': 'spiral',
      'afro': 'stars',
      'bald': 'none'
    };
    
    // Map outfit to decoration
    const decorationMap = {
      'formal': 'ribbons',
      'casual': 'bows',
      'sporty': 'confetti',
      'geek': 'initials',
      'cyberpunk': 'neon'
    };
    
    // Determine expression based on user title
    // 'tired' for "veterano", 'happy' (default) for "calouro"
    // Tipagem explícita para garantir que é um dos valores permitidos
    const expression: 'tired' | 'happy' = user.title?.toLowerCase().includes('veterano') ? 'tired' : 'happy';
    
    return {
      color: avatarConfig.skinTone,
      detailColor: avatarConfig.hairColor,
      pattern: patternMap[avatarConfig.hairStyle as keyof typeof patternMap] || 'dots',
      shape: shapeMap[avatarConfig.bodyType as keyof typeof shapeMap] || 'round',
      decoration: decorationMap[avatarConfig.outfit as keyof typeof decorationMap] || 'none',
      accessories: avatarConfig.accessories,
      expression
    };
  };
  
  return (
    <motion.div
      className={sizeClasses[size]}
      animate={showAnimation ? animation : undefined}
      variants={avatarAnimations}
    >
      {avatarConfig && mapConfigToBalloonProps() ? (
        <BalloonAvatar 
          {...mapConfigToBalloonProps() as BalloonAvatarProps}
          size={size}
          className={className}
        />
      ) : (
        <Avatar className={`${sizeClasses[size]} border-2 border-primary ${className}`}>
          <AvatarFallback className="text-primary font-fira">
            {user.username.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}
    </motion.div>
  );
};

export default AnimatedAvatar;