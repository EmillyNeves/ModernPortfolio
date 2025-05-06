import React from "react";
import { Progress } from "@/components/ui/progress";
import { getStatColor } from "@/lib/utils";
import { User } from "@shared/schema";

interface CharacterProfileProps {
  user: User;
}

const CharacterProfile: React.FC<CharacterProfileProps> = ({ user }) => {
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
    <div className="terminal-window p-4">
      <div className="flex items-center mb-4">
        <div className="rounded-md w-12 h-12 mr-3 border border-accent overflow-hidden">
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
              <rect width="36" height="36" fill="#00D9FF" />
              <rect
                x="0"
                y="0"
                width="36"
                height="36"
                transform="translate(9 -5) rotate(219 18 18) scale(1.1)"
                fill="#00FF8C"
                rx="6"
              />
              <g transform="translate(4.5 -4) rotate(9 18 18)">
                <path d="M15 19c2 1 4 1 6 0" stroke="#000000" fill="none" strokeLinecap="round" />
                <rect
                  x="10"
                  y="14"
                  width="1.5"
                  height="2"
                  rx="1"
                  stroke="none"
                  fill="#000000"
                />
                <rect
                  x="24"
                  y="14"
                  width="1.5"
                  height="2"
                  rx="1"
                  stroke="none"
                  fill="#000000"
                />
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
