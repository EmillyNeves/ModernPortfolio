import React from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@shared/schema";
import { AvatarConfig } from "./AvatarEditor";

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
    
    // Build SVG parts based on config
    let svg = '';
    
    // Body shape based on body type
    const bodyShape = avatarConfig.bodyType === 'athletic' ? 
      `<rect x="35" y="55" width="30" height="40" rx="5" fill="${skinTone}" />` :
      avatarConfig.bodyType === 'slim' ?
      `<rect x="40" y="55" width="20" height="45" rx="5" fill="${skinTone}" />` :
      `<rect x="30" y="55" width="40" height="40" rx="10" fill="${skinTone}" />`;
    
    // Head
    const head = `<circle cx="50" cy="35" r="20" fill="${skinTone}" />`;
    
    // Hair style
    let hair = '';
    switch(avatarConfig.hairStyle) {
      case 'short':
        hair = `<path d="M30 25 Q50 10 70 25 L70 35 Q50 45 30 35 Z" fill="${hairColor}" />`;
        break;
      case 'long':
        hair = `<path d="M30 25 Q50 10 70 25 L70 45 Q50 55 30 45 Z" fill="${hairColor}" />`;
        break;
      case 'curly':
        hair = `
          <circle cx="40" cy="20" r="8" fill="${hairColor}" />
          <circle cx="50" cy="15" r="8" fill="${hairColor}" />
          <circle cx="60" cy="20" r="8" fill="${hairColor}" />
          <circle cx="35" cy="30" r="6" fill="${hairColor}" />
          <circle cx="65" cy="30" r="6" fill="${hairColor}" />
        `;
        break;
      case 'afro':
        hair = `<circle cx="50" cy="25" r="25" fill="${hairColor}" />`;
        break;
      case 'bald':
        hair = ''; // No hair
        break;
    }
    
    // Outfit
    let outfit = '';
    switch(avatarConfig.outfit) {
      case 'formal':
        outfit = `
          <rect x="35" y="55" width="30" height="40" rx="2" fill="#000066" />
          <rect x="45" y="55" width="10" height="40" fill="#ffffff" />
          <circle cx="50" cy="65" r="2" fill="#000000" />
        `;
        break;
      case 'casual':
        outfit = `
          <rect x="35" y="55" width="30" height="35" rx="2" fill="#3366cc" />
          <rect x="35" y="85" width="30" height="10" rx="0" fill="#1a1a1a" />
        `;
        break;
      case 'sporty':
        outfit = `
          <rect x="35" y="55" width="30" height="30" rx="2" fill="#cc3333" />
          <rect x="35" y="85" width="30" height="10" rx="0" fill="#333333" />
        `;
        break;
      case 'geek':
        outfit = `
          <rect x="35" y="55" width="30" height="40" rx="2" fill="#663399" />
          <text x="50" y="75" font-size="8" text-anchor="middle" fill="white">01010</text>
        `;
        break;
      case 'cyberpunk':
        outfit = `
          <rect x="35" y="55" width="30" height="40" rx="2" fill="#000000" />
          <path d="M35 60 L65 60 L65 65 L35 65 Z" fill="#00ffff" />
          <path d="M35 75 L65 75 L65 80 L35 80 Z" fill="#ff00ff" />
        `;
        break;
    }
    
    // Accessories
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
        <path d="M25 25 L75 25 L65 15 L35 15 Z" fill="#444444" />
      `;
    }
    
    // Combine all parts
    svg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <rect width="100" height="100" fill="none" />
      ${bodyShape}
      ${outfit}
      ${head}
      ${hair}
      ${accessories}
      <circle cx="42" cy="33" r="2" fill="black" />
      <circle cx="58" cy="33" r="2" fill="black" />
      <path d="M45 42 Q50 45 55 42" fill="none" stroke="black" stroke-width="1" />
    </svg>`;
    
    return svg;
  };

  return (
    <motion.div
      className={sizeClasses[size]}
      animate={showAnimation ? animation : undefined}
      variants={avatarAnimations}
    >
      <Avatar className={`${sizeClasses[size]} border-2 border-primary ${className}`}>
        {avatarConfig && (
          <AvatarImage src={generateAvatarSVG()} alt={user.username} />
        )}
        <AvatarFallback className="text-primary font-fira">
          {user.username.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
    </motion.div>
  );
};

export default AnimatedAvatar;