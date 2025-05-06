import React from "react";

interface SpeechBubbleProps {
  title: string;
  message: string;
}

const SpeechBubble: React.FC<SpeechBubbleProps> = ({ title, message }) => {
  return (
    <div className="speech-bubble p-4 max-w-lg">
      <p className="text-primary font-fira text-sm mb-2 title-caps">{title}:</p>
      <p className="text-white/90 font-fira text-xs">{message}</p>
    </div>
  );
};

export default SpeechBubble;
