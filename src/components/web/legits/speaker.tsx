import { useState } from "react";
import { Volume2 } from "lucide-react";

interface ReadTextButtonProps {
  text: string; // ✅ explicitly declare the prop type
}

export default function ReadTextButton({ text }: ReadTextButtonProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = () => {
    window.speechSynthesis.cancel();

    if (!isSpeaking) {
      const utterance = new SpeechSynthesisUtterance(text);
      setIsSpeaking(true);

      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsSpeaking(false);
    }
  };

  return (
    <button
      onClick={handleSpeak}
      className={`p-2 bg-transparent border-none cursor-pointer hover:text-blue-500 focus:outline-none ${
        isSpeaking ? "text-blue-600 animate-pulse" : ""
      }`}
      title="Read aloud"
    >
      <Volume2 className="w-6 h-6" />
    </button>
  );
}
