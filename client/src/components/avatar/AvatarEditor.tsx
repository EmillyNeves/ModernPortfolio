import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";
import { User } from "@shared/schema";
import BalloonAvatar from "./balloonAvatars";

interface AvatarEditorProps {
  user: User;
  onSave: (avatarConfig: AvatarConfig) => void;
  onCancel: () => void;
}

export interface AvatarConfig {
  bodyType: string;
  hairStyle: string;
  hairColor: string;
  skinTone: string;
  accessories: string[];
  outfit: string;
  animation: string;
}

// Default avatar configuration
const defaultAvatarConfig: AvatarConfig = {
  bodyType: "athletic",
  hairStyle: "short",
  hairColor: "#1a1a1a",
  skinTone: "#f5d0a9",
  accessories: ["glasses"],
  outfit: "casual",
  animation: "idle"
};

// Animation options
const animationOptions = [
  { id: "idle", name: "Parado", description: "Avatar em estado de espera" },
  { id: "walk", name: "Andando", description: "Avatar andando" },
  { id: "run", name: "Correndo", description: "Avatar correndo" },
  { id: "thinking", name: "Pensando", description: "Avatar pensativo" },
  { id: "studying", name: "Estudando", description: "Avatar estudando" },
  { id: "celebrating", name: "Comemorando", description: "Avatar comemorando" }
];

// Pattern styles (anteriormente estilos de cabelo)
const hairStyles = [
  { id: "short", name: "Bolinhas" },
  { id: "long", name: "Listras" },
  { id: "curly", name: "Espiral" },
  { id: "afro", name: "Estrelas" },
  { id: "bald", name: "Liso" }
];

// Outfits (decorações externas)
const outfitOptions = [
  { id: "casual", name: "Laços" },
  { id: "formal", name: "Fitas" },
  { id: "sporty", name: "Confete" },
  { id: "geek", name: "Iniciais" },
  { id: "cyberpunk", name: "Neon" }
];

// Accessories
const accessoryOptions = [
  { id: "glasses", name: "Óculos" },
  { id: "hat", name: "Chapéu" },
  { id: "earrings", name: "Brincos" },
  { id: "necklace", name: "Colar" },
  { id: "watch", name: "Relógio" }
];

const AvatarEditor: React.FC<AvatarEditorProps> = ({ user, onSave, onCancel }) => {
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>(defaultAvatarConfig);
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);

  useEffect(() => {
    // If user has existing avatar config, load it
    if (user.avatarConfig) {
      try {
        const config = JSON.parse(user.avatarConfig as string) as AvatarConfig;
        setAvatarConfig(config);
        setSelectedAccessories(config.accessories);
      } catch (e) {
        console.error("Failed to parse avatar config", e);
      }
    }
  }, [user]);

  const handleSave = () => {
    const updatedConfig = {
      ...avatarConfig,
      accessories: selectedAccessories
    };
    onSave(updatedConfig);
  };

  const handleAccessoryToggle = (accessoryId: string) => {
    if (selectedAccessories.includes(accessoryId)) {
      setSelectedAccessories(selectedAccessories.filter(a => a !== accessoryId));
    } else {
      setSelectedAccessories([...selectedAccessories, accessoryId]);
    }
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

  // Generate avatar SVG based on config
  const generateAvatarSVG = () => {
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
    
    if (selectedAccessories.includes('glasses')) {
      accessories += `
        <circle cx="40" cy="35" r="5" fill="none" stroke="#000000" stroke-width="1" />
        <circle cx="60" cy="35" r="5" fill="none" stroke="#000000" stroke-width="1" />
        <line x1="45" y1="35" x2="55" y2="35" stroke="#000000" stroke-width="1" />
      `;
    }
    
    if (selectedAccessories.includes('hat')) {
      accessories += `
        <path d="M30 20 L70 20 L50 5 Z" fill="#444444" />
      `;
    }
    
    if (selectedAccessories.includes('earrings')) {
      accessories += `
        <circle cx="20" cy="40" r="3" fill="#ffcc00" />
        <circle cx="80" cy="40" r="3" fill="#ffcc00" />
      `;
    }
    
    if (selectedAccessories.includes('necklace')) {
      accessories += `
        <path d="M35 60 Q50 65 65 60" stroke="#ffcc00" stroke-width="1.5" fill="none" />
      `;
    }
    
    if (selectedAccessories.includes('watch')) {
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

  return (
    <div className="bg-background border border-primary/30 rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-orbitron text-primary mb-6">PERSONALIZAÇÃO DE AVATAR</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Avatar Preview */}
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-orbitron text-primary mb-4">PREVIEW</h3>
          <div className="bg-card rounded-lg border border-accent/30 p-4 mb-4 w-full flex justify-center">
            <motion.div
              className="w-32 h-32 mb-2"
              animate={avatarConfig.animation}
              variants={avatarAnimations}
            >
              {/* Use the new BalloonAvatar component */}
              <div className="w-32 h-32">
                <BalloonAvatar 
                  color={avatarConfig.skinTone}
                  detailColor={avatarConfig.hairColor}
                  pattern={
                    avatarConfig.hairStyle === 'short' ? 'dots' :
                    avatarConfig.hairStyle === 'long' ? 'stripes' :
                    avatarConfig.hairStyle === 'curly' ? 'spiral' :
                    avatarConfig.hairStyle === 'afro' ? 'stars' : 'none'
                  }
                  shape={
                    avatarConfig.bodyType === 'athletic' ? 'round' :
                    avatarConfig.bodyType === 'slim' ? 'oval' : 'square'
                  }
                  decoration={
                    avatarConfig.outfit === 'formal' ? 'ribbons' :
                    avatarConfig.outfit === 'casual' ? 'bows' :
                    avatarConfig.outfit === 'sporty' ? 'confetti' :
                    avatarConfig.outfit === 'geek' ? 'initials' : 'neon'
                  }
                  accessories={selectedAccessories}
                  size="xl"
                  className="border-4 border-primary rounded-full"
                />
              </div>
            </motion.div>
          </div>
          <p className="text-sm text-muted-foreground text-center mb-4">
            Animação atual: {animationOptions.find(a => a.id === avatarConfig.animation)?.name || "Parado"}
          </p>
          
          <div className="space-y-2 w-full">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleSave}
            >
              SALVAR
            </Button>
            <Button 
              variant="ghost" 
              className="w-full"
              onClick={onCancel}
            >
              CANCELAR
            </Button>
          </div>
        </div>
        
        {/* Editor Controls */}
        <div className="md:col-span-2">
          <Tabs defaultValue="basics">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="basics" className="flex-1">BÁSICO</TabsTrigger>
              <TabsTrigger value="style" className="flex-1">ESTILO</TabsTrigger>
              <TabsTrigger value="animation" className="flex-1">ANIMAÇÃO</TabsTrigger>
            </TabsList>
            
            {/* Basic Tab */}
            <TabsContent value="basics" className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Formato do Balão:</label>
                <Select 
                  value={avatarConfig.bodyType}
                  onValueChange={(value) => setAvatarConfig({...avatarConfig, bodyType: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar tipo de corpo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="athletic">Redondo</SelectItem>
                    <SelectItem value="slim">Oval</SelectItem>
                    <SelectItem value="average">Quadrado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Padrão Decorativo:</label>
                <Select 
                  value={avatarConfig.hairStyle}
                  onValueChange={(value) => setAvatarConfig({...avatarConfig, hairStyle: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar estilo de cabelo" />
                  </SelectTrigger>
                  <SelectContent>
                    {hairStyles.map((style) => (
                      <SelectItem key={style.id} value={style.id}>{style.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Cor dos Detalhes:</label>
                <div className="flex items-center space-x-2">
                  <input 
                    type="color" 
                    value={avatarConfig.hairColor}
                    onChange={(e) => setAvatarConfig({...avatarConfig, hairColor: e.target.value})}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <span className="text-sm">{avatarConfig.hairColor}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Cor do Balão:</label>
                <div className="flex items-center space-x-2">
                  <input 
                    type="color" 
                    value={avatarConfig.skinTone}
                    onChange={(e) => setAvatarConfig({...avatarConfig, skinTone: e.target.value})}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <span className="text-sm">{avatarConfig.skinTone}</span>
                </div>
              </div>
            </TabsContent>
            
            {/* Style Tab */}
            <TabsContent value="style" className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Decoração Externa:</label>
                <Select 
                  value={avatarConfig.outfit}
                  onValueChange={(value) => setAvatarConfig({...avatarConfig, outfit: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar traje" />
                  </SelectTrigger>
                  <SelectContent>
                    {outfitOptions.map((outfit) => (
                      <SelectItem key={outfit.id} value={outfit.id}>{outfit.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Acessórios:</label>
                <div className="grid grid-cols-2 gap-2">
                  {accessoryOptions.map((accessory) => (
                    <div key={accessory.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={accessory.id}
                        checked={selectedAccessories.includes(accessory.id)}
                        onChange={() => handleAccessoryToggle(accessory.id)}
                        className="mr-2"
                      />
                      <label htmlFor={accessory.id}>{accessory.name}</label>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            {/* Animation Tab */}
            <TabsContent value="animation" className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                Escolha como seu avatar será animado no dashboard
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {animationOptions.map((animation) => (
                  <div 
                    key={animation.id}
                    className={`p-3 rounded-md border cursor-pointer transition-colors ${
                      avatarConfig.animation === animation.id 
                        ? 'border-primary bg-primary/10' 
                        : 'border-accent/20 hover:border-primary/50'
                    }`}
                    onClick={() => setAvatarConfig({...avatarConfig, animation: animation.id})}
                  >
                    <h4 className="font-medium text-primary">{animation.name}</h4>
                    <p className="text-xs text-muted-foreground">{animation.description}</p>
                  </div>
                ))}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Velocidade de Animação:</label>
                <Slider
                  defaultValue={[0.5]}
                  max={1}
                  step={0.1}
                  className="py-4"
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AvatarEditor;