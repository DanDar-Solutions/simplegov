"use client";

import { useState } from "react";
import type { ModernNewsItem } from "@/static/news/modern";
import Image from "next/image";
import { Volume2 } from "lucide-react";

interface NewsItemProps extends ModernNewsItem {
  i: number; // index for image
}

export default function NewsItem({
  id,
  title,
  date,
  category,
  summary,
  i,
}: NewsItemProps) {
  const [expanded, setExpanded] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const preview =
    summary.length > 200 ? summary.slice(0, 200) + "..." : summary;

  const imgSrc = `/news${i + 1}.png`;

  // 🔊 Speak only the summary text
  const handleSpeak = () => {
    window.speechSynthesis.cancel();

    if (!isSpeaking) {
      const utterance = new SpeechSynthesisUtterance(summary);
      utterance.onend = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsSpeaking(false);
    }
  };

  return (
    <article
      key={id}
      className="relative bg-gray-800 text-gray-100 rounded-lg shadow-md overflow-hidden flex w-80 h-64"
      aria-labelledby={`news-${id}`}
    >
      {/* 🔊 Speaker icon button */}
      <button
        onClick={handleSpeak}
        className={`absolute top-2 left-2 z-10 p-2 rounded-full bg-black/40 hover:bg-black/60 transition ${
          isSpeaking ? "text-blue-400 animate-pulse" : "text-gray-200"
        }`}
        title="Read summary aloud"
      >
        <Volume2 className="w-5 h-5" />
      </button>

      {/* Left: Image */}
      <div className="w-1/2 h-full relative">
        <Image src={imgSrc} alt={title} fill className="object-cover" priority />
      </div>

      {/* Right: Blurred content */}
      <div className="w-1/2 h-full p-4 flex flex-col justify-between backdrop-blur-sm bg-black/30">
        {/* Header */}
        <header className="mb-2">
          <h3
            id={`news-${id}`}
            className="text-lg font-semibold mb-1 overflow-hidden text-ellipsis line-clamp-2"
          >
            {title}
          </h3>
          <div className="text-xs text-gray-400 flex flex-wrap gap-2">
            {new Date(date).toLocaleDateString("mn-MN", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
            <span>• {category}</span>
          </div>
        </header>

        {/* Content */}
        <section className="text-sm text-gray-200 flex-1 overflow-hidden">
          <p
            className="transition-all"
            style={{ maxHeight: expanded ? "none" : "6rem" }}
          >
            {expanded ? summary : preview}
          </p>
        </section>

        {/* Learn More Button */}
        {summary.length > 200 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-2 self-start bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            {expanded ? "Show Less" : "Learn More"}
          </button>
        )}
      </div>
    </article>
  );
}
