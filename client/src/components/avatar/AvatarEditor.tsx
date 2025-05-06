import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";
import { User } from "@shared/schema";

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

// Hair styles
const hairStyles = [
  { id: "short", name: "Curto" },
  { id: "long", name: "Longo" },
  { id: "curly", name: "Cacheado" },
  { id: "afro", name: "Afro" },
  { id: "bald", name: "Careca" }
];

// Outfits
const outfitOptions = [
  { id: "casual", name: "Casual" },
  { id: "formal", name: "Formal" },
  { id: "sporty", name: "Esportivo" },
  { id: "geek", name: "Geek" },
  { id: "cyberpunk", name: "Cyberpunk" }
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

  // Generate the avatar SVG based on configuration
  const generateAvatarSVG = () => {
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
    if (selectedAccessories.includes('glasses')) {
      accessories += `
        <circle cx="40" cy="35" r="5" fill="none" stroke="#000000" stroke-width="1" />
        <circle cx="60" cy="35" r="5" fill="none" stroke="#000000" stroke-width="1" />
        <line x1="45" y1="35" x2="55" y2="35" stroke="#000000" stroke-width="1" />
      `;
    }
    
    if (selectedAccessories.includes('hat')) {
      accessories += `
        <path d="M25 25 L75 25 L65 15 L35 15 Z" fill="#444444" />
      `;
    }
    
    if (selectedAccessories.includes('earrings')) {
      accessories += `
        <circle cx="28" cy="35" r="2" fill="#ffcc00" />
        <circle cx="72" cy="35" r="2" fill="#ffcc00" />
      `;
    }
    
    if (selectedAccessories.includes('necklace')) {
      accessories += `
        <path d="M40 55 Q50 60 60 55" fill="none" stroke="#ffcc00" stroke-width="1" />
      `;
    }
    
    if (selectedAccessories.includes('watch')) {
      accessories += `
        <rect x="30" y="70" width="5" height="8" fill="#333333" />
        <circle cx="32.5" cy="74" r="3" fill="#ffffff" stroke="#333333" stroke-width="1" />
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
              <Avatar className="w-32 h-32 border-4 border-primary">
                <AvatarImage src={generateAvatarSVG()} alt={user.username} />
                <AvatarFallback className="text-primary text-2xl font-fira">
                  {user.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
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
                <label className="block text-sm font-medium mb-1">Tipo de Corpo:</label>
                <Select 
                  value={avatarConfig.bodyType}
                  onValueChange={(value) => setAvatarConfig({...avatarConfig, bodyType: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar tipo de corpo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="athletic">Atlético</SelectItem>
                    <SelectItem value="average">Médio</SelectItem>
                    <SelectItem value="slim">Esbelto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Cabelo:</label>
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
                <label className="block text-sm font-medium mb-1">Cor do Cabelo:</label>
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
                <label className="block text-sm font-medium mb-1">Tom de Pele:</label>
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
                <label className="block text-sm font-medium mb-1">Traje:</label>
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