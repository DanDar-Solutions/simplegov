"use client";

import { useState } from "react";
import type { ModernNewsItem } from "@/static/news/modern";

export default function NewsItem({ id, url, title, date, category, summary }: ModernNewsItem) {
  const [expanded, setExpanded] = useState(false);

  const preview = summary.length > 200 ? summary.slice(0, 200) + "..." : summary;

  return (
    <article
      key={id}
      className="bg-gray-800 text-gray-100 rounded-lg shadow-md p-4 flex flex-col justify-between w-80 h-64 overflow-hidden"
      aria-labelledby={`news-${id}`}
    >
      {/* Header */}
      <header className="mb-2">
        <h3 id={`news-${id}`} className="text-lg font-semibold mb-1">
          {title}
        </h3>
        <div className="text-xs text-gray-400 flex flex-wrap gap-2">
          <time dateTime={date}>
            {new Date(date).toLocaleDateString("mn-MN", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </time>
          <span>• {category}</span>
        </div>
      </header>

      {/* Content */}
      <section className="text-sm text-gray-300 flex-1 overflow-hidden">
        <p className="transition-all" style={{ maxHeight: expanded ? "none" : "6rem" }}>
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
    </article>
  );
}

/** Detects if content looks like HTML */
function isHtml(_str: string): boolean {
  return false;
}
