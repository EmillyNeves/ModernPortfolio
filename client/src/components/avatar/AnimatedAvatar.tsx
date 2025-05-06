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

    // Basic SVG with customized colors
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" fill="${avatarConfig.skinTone}" /><circle cx="50" cy="40" r="20" fill="${avatarConfig.hairColor}" /><text x="50" y="50" font-size="12" text-anchor="middle" fill="white">${user.username}</text></svg>`;
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