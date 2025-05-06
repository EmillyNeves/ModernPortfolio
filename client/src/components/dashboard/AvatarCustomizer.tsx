import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "@shared/schema";

interface AvatarCustomizerProps {
  user: User;
  onSave: (avatarConfig: AvatarConfig) => void;
}

export interface AvatarConfig {
  skinColor: string;
  eyesStyle: number;
  mouthStyle: number;
  accessory: string;
  hairStyle: string;
  hairColor: string;
}

const SKIN_COLORS = [
  "#FFDBAC", // light skin
  "#F1C27D", // medium-light skin
  "#E0AC69", // medium skin
  "#C68642", // medium-dark skin
  "#8D5524", // dark skin
  "#FFD6D6", // fantasy light pink
  "#C8FFCE", // fantasy light green
  "#D6E0FF", // fantasy light blue
];

const HAIR_COLORS = [
  "#000000", // black
  "#4E3521", // dark brown
  "#8C5E26", // medium brown
  "#D4B37F", // light brown/blonde
  "#FF6347", // red
  "#008080", // teal
  "#6A0DAD", // purple
  "#FF69B4", // pink
];

const HAIR_STYLES = [
  "short",
  "medium",
  "long",
  "afro",
  "bald",
  "mohawk",
  "ponytail",
  "side-part",
];

const ACCESSORIES = [
  "none",
  "glasses",
  "sunglasses",
  "earrings",
  "face-paint",
  "tattoo",
  "cyber-implant",
  "hat",
];

const AvatarCustomizer: React.FC<AvatarCustomizerProps> = ({ user, onSave }) => {
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>({
    skinColor: "#00D9FF",
    eyesStyle: 1,
    mouthStyle: 1,
    accessory: "none",
    hairStyle: "short",
    hairColor: "#000000",
  });

  const handleColorChange = (type: "skinColor" | "hairColor", color: string) => {
    setAvatarConfig((prev) => ({
      ...prev,
      [type]: color,
    }));
  };

  const handleStyleChange = (
    type: "eyesStyle" | "mouthStyle",
    value: number
  ) => {
    setAvatarConfig((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const handleStringOptionChange = (
    type: "accessory" | "hairStyle",
    value: string
  ) => {
    setAvatarConfig((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const renderAvatar = () => {
    // This is a simplified avatar preview
    // In a real application, you would use the config to generate a more complex SVG
    return (
      <svg
        viewBox="0 0 36 36"
        fill="none"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        className="w-32 h-32 bg-card mx-auto"
      >
        <mask id="mask__beam_preview" maskUnits="userSpaceOnUse" x="0" y="0" width="36" height="36">
          <rect width="36" height="36" rx="72" fill="#FFFFFF" />
        </mask>
        <g mask="url(#mask__beam_preview)">
          <rect width="36" height="36" fill={avatarConfig.skinColor} />
          <rect
            x="0"
            y="0"
            width="36"
            height="36"
            transform="translate(9 -5) rotate(219 18 18) scale(1.1)"
            fill={avatarConfig.hairColor}
            rx="6"
          />
          <g transform="translate(4.5 -4) rotate(9 18 18)">
            <path 
              d={avatarConfig.mouthStyle === 1 ? "M15 19c2 1 4 1 6 0" : "M13 19c2 -1 8 -1 10 0"}
              stroke="#000000" 
              fill="none" 
              strokeLinecap="round" 
            />
            <rect
              x={avatarConfig.eyesStyle === 1 ? "10" : "12"}
              y="14"
              width={avatarConfig.eyesStyle === 1 ? "1.5" : "2"}
              height="2"
              rx="1"
              stroke="none"
              fill="#000000"
            />
            <rect
              x={avatarConfig.eyesStyle === 1 ? "24" : "22"}
              y="14"
              width={avatarConfig.eyesStyle === 1 ? "1.5" : "2"}
              height="2"
              rx="1"
              stroke="none"
              fill="#000000"
            />
          </g>
        </g>
      </svg>
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-xs font-fira text-accent hover:text-accent/80 absolute bottom-2 right-2"
        >
          Editar Avatar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md bg-card border border-accent/30">
        <DialogHeader>
          <DialogTitle className="text-primary font-orbitron">
            PERSONALIZAR AVATAR
          </DialogTitle>
          <DialogDescription className="font-fira text-white/70 text-xs">
            Personalize a aparência do seu personagem ajustando as opções abaixo.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="appearance" className="mt-4">
          <TabsList className="w-full bg-background/10">
            <TabsTrigger value="appearance" className="font-fira">
              Aparência
            </TabsTrigger>
            <TabsTrigger value="features" className="font-fira">
              Características
            </TabsTrigger>
            <TabsTrigger value="accessories" className="font-fira">
              Acessórios
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="appearance" className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="font-fira text-white/90 text-xs">Tom de Pele</div>
              <div className="flex flex-wrap gap-2">
                {SKIN_COLORS.map((color) => (
                  <div
                    key={color}
                    className={`w-8 h-8 rounded-full cursor-pointer transition-all ${
                      avatarConfig.skinColor === color
                        ? "ring-2 ring-primary scale-110"
                        : ""
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorChange("skinColor", color)}
                  />
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="font-fira text-white/90 text-xs">Cor do Cabelo</div>
              <div className="flex flex-wrap gap-2">
                {HAIR_COLORS.map((color) => (
                  <div
                    key={color}
                    className={`w-8 h-8 rounded-full cursor-pointer transition-all ${
                      avatarConfig.hairColor === color
                        ? "ring-2 ring-primary scale-110"
                        : ""
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorChange("hairColor", color)}
                  />
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="features" className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="font-fira text-white/90 text-xs">Estilo dos Olhos</div>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4].map((style) => (
                  <div
                    key={style}
                    className={`w-12 h-12 rounded-md cursor-pointer flex items-center justify-center border ${
                      avatarConfig.eyesStyle === style
                        ? "border-primary bg-primary/20"
                        : "border-white/20 bg-background/20"
                    }`}
                    onClick={() => handleStyleChange("eyesStyle", style)}
                  >
                    <span className="font-mono">{style}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="font-fira text-white/90 text-xs">Estilo da Boca</div>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4].map((style) => (
                  <div
                    key={style}
                    className={`w-12 h-12 rounded-md cursor-pointer flex items-center justify-center border ${
                      avatarConfig.mouthStyle === style
                        ? "border-primary bg-primary/20"
                        : "border-white/20 bg-background/20"
                    }`}
                    onClick={() => handleStyleChange("mouthStyle", style)}
                  >
                    <span className="font-mono">{style}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="accessories" className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="font-fira text-white/90 text-xs">Penteado</div>
              <div className="flex flex-wrap gap-2">
                {HAIR_STYLES.map((style) => (
                  <div
                    key={style}
                    className={`px-3 py-2 rounded-md cursor-pointer text-xs font-fira ${
                      avatarConfig.hairStyle === style
                        ? "bg-primary/20 text-primary border border-primary/50"
                        : "bg-background/20 text-white/70 border border-white/10"
                    }`}
                    onClick={() => handleStringOptionChange("hairStyle", style)}
                  >
                    {style}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="font-fira text-white/90 text-xs">Acessórios</div>
              <div className="flex flex-wrap gap-2">
                {ACCESSORIES.map((item) => (
                  <div
                    key={item}
                    className={`px-3 py-2 rounded-md cursor-pointer text-xs font-fira ${
                      avatarConfig.accessory === item
                        ? "bg-primary/20 text-primary border border-primary/50"
                        : "bg-background/20 text-white/70 border border-white/10"
                    }`}
                    onClick={() => handleStringOptionChange("accessory", item)}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 p-4 bg-background/30 rounded-md">
          <div className="text-center font-fira text-white/90 text-xs mb-4">
            Visualização do Avatar
          </div>
          {renderAvatar()}
        </div>

        <DialogFooter className="mt-6">
          <Button
            variant="outline"
            className="font-fira text-white/70 text-xs"
            type="button"
          >
            Cancelar
          </Button>
          <Button
            className="font-fira bg-primary text-white text-xs hover:bg-primary/80"
            type="button"
            onClick={() => onSave(avatarConfig)}
          >
            Salvar Avatar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AvatarCustomizer;