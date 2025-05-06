import React, { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { getStatColor } from "@/lib/utils";
import { User } from "@shared/schema";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import AvatarCustomizer, { AvatarConfig } from "./AvatarCustomizer";
import { useToast } from "@/hooks/use-toast";

interface CharacterProfileProps {
  user: User;
}

const CharacterProfile: React.FC<CharacterProfileProps> = ({ user }) => {
  const { toast } = useToast();
  const [avatar, setAvatar] = useState(user.avatar || {
    skinColor: "#00D9FF",
    eyesStyle: 1,
    mouthStyle: 1,
    accessory: "none",
    hairStyle: "short",
    hairColor: "#00FF8C",
  });

  const saveAvatarMutation = useMutation({
    mutationFn: async (avatarConfig: AvatarConfig) => {
      const response = await apiRequest("/api/user/avatar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ avatar: avatarConfig }),
      });
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Avatar atualizado",
        description: "Seu avatar foi personalizado com sucesso!",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar seu avatar. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleSaveAvatar = (avatarConfig: AvatarConfig) => {
    setAvatar(avatarConfig);
    saveAvatarMutation.mutate(avatarConfig);
  };

  const statItems = [
    {
      label: "INTELLIGENCE",
      value: user.stats.intelligence,
      max: 100,
    },
    {
      label: "LOGIC",
      value: user.stats.logic,
      max: 100,
    },
    {
      label: "MEMORY",
      value: user.stats.memory,
      max: 100,
    },
    {
      label: "ENERGY",
      value: user.stats.energy,
      max: 100,
    },
  ];

  // Calculate XP percentage for level progress
  const xpPercentage = (user.xp.current / user.xp.max) * 100;

  return (
    <div className="terminal-window p-4 relative">
      <div className="flex items-center mb-4">
        <div className="rounded-md w-12 h-12 mr-3 border border-accent overflow-hidden relative">
          <svg
            viewBox="0 0 36 36"
            fill="none"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full bg-card"
          >
            <mask id="mask__beam" maskUnits="userSpaceOnUse" x="0" y="0" width="36" height="36">
              <rect width="36" height="36" rx="72" fill="#FFFFFF" />
            </mask>
            <g mask="url(#mask__beam)">
              <rect width="36" height="36" fill={avatar.skinColor} />
              <rect
                x="0"
                y="0"
                width="36"
                height="36"
                transform="translate(9 -5) rotate(219 18 18) scale(1.1)"
                fill={avatar.hairColor}
                rx="6"
              />
              <g transform="translate(4.5 -4) rotate(9 18 18)">
                <path 
                  d={avatar.mouthStyle === 1 ? "M15 19c2 1 4 1 6 0" : "M13 19c2 -1 8 -1 10 0"}
                  stroke="#000000" 
                  fill="none" 
                  strokeLinecap="round" 
                />
                <rect
                  x={avatar.eyesStyle === 1 ? "10" : "12"}
                  y="14"
                  width={avatar.eyesStyle === 1 ? "1.5" : "2"}
                  height="2"
                  rx="1"
                  stroke="none"
                  fill="#000000"
                />
                <rect
                  x={avatar.eyesStyle === 1 ? "24" : "22"}
                  y="14"
                  width={avatar.eyesStyle === 1 ? "1.5" : "2"}
                  height="2"
                  rx="1"
                  stroke="none"
                  fill="#000000"
                />
                {avatar.accessory === "glasses" && (
                  <path
                    d="M12 14 L24 14"
                    stroke="#000000"
                    strokeWidth="0.6"
                    fill="none"
                  />
                )}
              </g>
            </g>
          </svg>
        </div>
        <div>
          <div className="flex items-center">
            <span className="text-primary font-orbitron text-sm">Nick: </span>
            <span className="text-accent font-orbitron ml-1">{user.username}</span>
          </div>
          <div className="flex items-center mt-1">
            <span className="text-white/70 font-fira text-xs">Título: </span>
            <span className="text-white/90 font-fira text-xs ml-1">{user.title}</span>
          </div>
        </div>
      </div>

      {/* Avatar Customizer */}
      <AvatarCustomizer user={user} onSave={handleSaveAvatar} />

      {/* Stats Section */}
      <div className="mt-4">
        <h3 className="text-secondary font-orbitron text-sm border-b border-secondary/30 pb-1 mb-3">
          CHARACTER_STATS
        </h3>

        <div className="space-y-3 font-fira text-xs">
          {statItems.map((stat) => (
            <div key={stat.label}>
              <div className="flex justify-between">
                <span className="text-white/80">{stat.label}</span>
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
          <span className="text-white/90 font-orbitron text-xs">LEVEL</span>
          <span className="text-primary font-orbitron text-lg">{user.level}</span>
        </div>
        <Progress value={xpPercentage} className="mt-2" indicatorColor="bg-primary" />
        <div className="flex justify-between mt-1">
          <span className="text-white/60 font-fira text-xs">
            XP: {user.xp.current}/{user.xp.max}
          </span>
          <span className="text-white/60 font-fira text-xs">{xpPercentage.toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
};

export default CharacterProfile;
