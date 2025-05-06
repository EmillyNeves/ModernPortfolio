import React, { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { getStatColor } from "@/lib/utils";
import { User } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import AnimatedAvatar from "@/components/avatar/AnimatedAvatar";
import AvatarEditor, { AvatarConfig } from "@/components/avatar/AvatarEditor";

interface CharacterProfileProps {
  user: User;
}

const CharacterProfile: React.FC<CharacterProfileProps> = ({ user }) => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>(user);
  const { toast } = useToast();

  const statItems = [
    {
      label: "INTELLIGENCE",
      value: currentUser.stats.intelligence,
      max: 100,
    },
    {
      label: "LOGIC",
      value: currentUser.stats.logic,
      max: 100,
    },
    {
      label: "MEMORY",
      value: currentUser.stats.memory,
      max: 100,
    },
    {
      label: "ENERGY",
      value: currentUser.stats.energy,
      max: 100,
    },
  ];

  // Calculate XP percentage for level progress
  const xpPercentage = (currentUser.xp.current / currentUser.xp.max) * 100;

  const handleAvatarSave = async (avatarConfig: AvatarConfig) => {
    try {
      // Convert config to JSON string
      const configString = JSON.stringify(avatarConfig);
      
      // Update user in database
      const response = await apiRequest(
        'POST', 
        '/api/user/avatar', 
        { avatarConfig: configString }
      );
      
      const updatedUser = await response.json();
      setCurrentUser(updatedUser);
      toast({
        title: "Avatar atualizado",
        description: "Seu avatar foi personalizado com sucesso!",
      });
    } catch (error) {
      console.error('Error saving avatar:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as alterações do avatar.",
        variant: "destructive",
      });
    } finally {
      setIsEditorOpen(false);
    }
  };

  return (
    <div className="terminal-window p-4">
      <div className="flex items-center mb-4">
        <div 
          className="relative group cursor-pointer" 
          onClick={() => setIsEditorOpen(true)}
        >
          <AnimatedAvatar 
            user={currentUser} 
            size="md" 
            className="mr-3 border-accent"
          />
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-white text-xs font-fira">Editar</span>
          </div>
        </div>
        
        <div>
          <div className="flex items-center">
            <span className="text-primary font-orbitron text-sm">Nick: </span>
            <span className="text-accent font-orbitron ml-1">{currentUser.username}</span>
          </div>
          <div className="flex items-center mt-1">
            <span className="text-white/70 font-fira text-xs">Título: </span>
            <span className="text-white/90 font-fira text-xs ml-1">{currentUser.title}</span>
          </div>
        </div>
      </div>

      {/* Avatar Editor Button */}
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setIsEditorOpen(true)}
        className="w-full text-xs mb-4 border-accent/50 text-accent hover:text-accent hover:bg-accent/10"
      >
        PERSONALIZAR AVATAR
      </Button>

      {/* Stats Section */}
      <div className="mt-4">
        <h3 className="text-secondary font-orbitron text-sm border-b border-secondary/30 pb-1 mb-3 title-caps">
          CHARACTER_STATS
        </h3>

        <div className="space-y-3 font-fira text-xs">
          {statItems.map((stat) => (
            <div key={stat.label}>
              <div className="flex justify-between">
                <span className="text-white/80 title-caps">{stat.label}</span>
                <span className={stat.value < 60 ? "text-yellow-400" : "text-accent"}>
                  {stat.value}/{stat.max}
                </span>
              </div>
              <Progress
                value={stat.value}
                className="mt-1"
                indicatorColor={getStatColor(stat.value)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Level Progress */}
      <div className="mt-6">
        <div className="flex justify-between items-center">
          <span className="text-white/90 font-orbitron text-xs title-caps">LEVEL</span>
          <span className="text-primary font-orbitron text-lg">{currentUser.level}</span>
        </div>
        <Progress value={xpPercentage} className="mt-2" indicatorColor="bg-primary" />
        <div className="flex justify-between mt-1">
          <span className="text-white/60 font-fira text-xs">
            XP: {currentUser.xp.current}/{currentUser.xp.max}
          </span>
          <span className="text-white/60 font-fira text-xs">{xpPercentage.toFixed(0)}%</span>
        </div>
      </div>

      {/* Avatar Editor Dialog */}
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="p-0 max-w-4xl w-[95vw]" aria-describedby="avatar-editor-description">
          <DialogTitle className="sr-only">Editor de Avatar</DialogTitle>
          <div id="avatar-editor-description" className="sr-only">
            Editor para personalização do avatar do usuário
          </div>
          <AvatarEditor 
            user={currentUser} 
            onSave={handleAvatarSave}
            onCancel={() => setIsEditorOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CharacterProfile;
