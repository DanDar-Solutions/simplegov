"use client";

import React, { useEffect, useRef, useState } from "react";

type Member = {
  id: number;
  summary: string;
  stats: string[];
  region: string;
  details?: string[];
  img?: string;
};

type Props = {
  data: Member[];
};

const STAR_COUNT = 5;

export default function SwipeWidget({ data }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [avatarUrl, setAvatarUrl] = useState<string>(data[0]?.img ?? "");
  const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(null);
  const [enterFrom, setEnterFrom] = useState<"left" | "right" | null>(null);
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [currentRating, setCurrentRating] = useState<number>(0);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [hoverRating, setHoverRating] = useState<number>(0);

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchLastX = useRef<number | null>(null);
  const touchLastY = useRef<number | null>(null);

  // Load ratings from localStorage on mount
  useEffect(() => {
    try {
      const stored: Record<number, number> = {};
      data.forEach((m) => {
        const v = localStorage.getItem(`sv_rating_${m.id}`);
        if (v) stored[m.id] = Number(v);
      });
      setRatings(stored);
    } catch {
      // ignore storage issues
    }
  }, [data]);

  const currentItem = data[currentIndex];

  // Refresh avatar whenever the current card changes
  useEffect(() => {
    const id = data[currentIndex]?.id ?? 1;
    setAvatarUrl(data[currentIndex]?.img ?? "");
    // Sync current rating to selected card
    setCurrentRating((prev) => (id ? ratings[id] ?? 0 : 0));
  }, [currentIndex, data, ratings]);

  const goNext = () => {
    if (exitDirection || enterFrom) return;
    setExitDirection("right");
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % data.length);
      setExitDirection(null);
      setEnterFrom("left");
      // allow DOM to apply off-screen state before animating to neutral
      setTimeout(() => setEnterFrom(null), 20);
    }, 220);
  };

  const goBack = () => {
    if (exitDirection || enterFrom) return;
    setExitDirection("left");
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + data.length) % data.length);
      setExitDirection(null);
      setEnterFrom("right");
      setTimeout(() => setEnterFrom(null), 20);
    }, 220);
  };

  const handleRate = (stars: number) => {
    const memberId = currentItem.id;
    const nextRatings = { ...ratings, [memberId]: stars };
    setRatings(nextRatings);
    setCurrentRating(stars);
    try {
      localStorage.setItem(`sv_rating_${memberId}`, String(stars));
    } catch {
      // ignore storage issues
    }
    // Auto advance
    goNext();
  };

  const onTouchStart: React.TouchEventHandler<HTMLDivElement> = (e) => {
    const t = e.touches[0];
    touchStartX.current = t.clientX;
    touchStartY.current = t.clientY;
    touchLastX.current = t.clientX;
    touchLastY.current = t.clientY;
  };

  const onTouchMove: React.TouchEventHandler<HTMLDivElement> = (e) => {
    const t = e.touches[0];
    if (!t) return;
    touchLastX.current = t.clientX;
    touchLastY.current = t.clientY;
  };

  const onTouchEnd: React.TouchEventHandler<HTMLDivElement> = (e) => {
    if (touchStartX.current == null || touchStartY.current == null) return;
    const endX =
      touchLastX.current != null
        ? touchLastX.current
        : e.changedTouches[0]?.clientX ?? touchStartX.current;
    const endY =
      touchLastY.current != null
        ? touchLastY.current
        : e.changedTouches[0]?.clientY ?? touchStartY.current;
    const dx = endX - touchStartX.current;
    const dy = endY - touchStartY.current;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    touchStartX.current = null;
    touchStartY.current = null;
    touchLastX.current = null;
    touchLastY.current = null;
    // Only act on horizontal, strong enough swipes
    if (!exitDirection && !enterFrom && absDx > 40 && absDx > absDy) {
      if (dx > 0) {
        // swipe right -> back
        goBack();
      } else if (dx < 0) {
        // swipe left -> next
        goNext();
      }
    }
  };

  const memberRating = currentRating;
  const progressPercent =
    data.length > 0
      ? Math.min(
          100,
          Math.max(0, Math.round(((currentIndex + 1) / data.length) * 100))
        )
      : 0;
  const isAnimating = Boolean(exitDirection || enterFrom);

  return (
    <div className="w-full flex justify-center items-center">
      <div className={["relative w-full max-w-[375px]"].join(" ")}>
        <div
          className={[
            "rounded-3xl shadow-xl bg-white p-4 select-none border border-gray-100 relative",
            "transform transition-all duration-200 ease-out will-change-transform",
            exitDirection === "right" ? "translate-x-4 rotate-1 opacity-0 scale-95" : "",
            exitDirection === "left" ? "-translate-x-4 -rotate-1 opacity-0 scale-95" : "",
            !exitDirection && enterFrom === "left" ? "-translate-x-4 opacity-0 scale-95" : "",
            !exitDirection && enterFrom === "right" ? "translate-x-4 opacity-0 scale-95" : "",
            !exitDirection && !enterFrom ? "translate-x-0 opacity-100 scale-100" : ""
          ].join(" ")}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="absolute top-3 left-3 text-[11px] text-gray-600 bg-white/80 backdrop-blur px-2 py-1 rounded-full shadow-sm">
            Карт {currentIndex + 1} / {data.length}
          </div>
          {/* Avatar */}
          <div className="w-full mb-4 flex items-center justify-center pt-1">
            <div className="p-[4px] rounded-full bg-linear-to-r from-indigo-500/50 via-pink-500/50 to-yellow-500/50">
              <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-100 ring-8 ring-white">
                <img
                  src={avatarUrl}
                  alt="Профайл зураг"
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-3">
            <p className="text-sm text-gray-800 leading-relaxed wrap-break-word">
              {currentItem.summary}
            </p>
            <div className="flex flex-wrap gap-2">
              {currentItem.stats.map((s, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-xs wrap-break-word leading-tight"
                >
                  {s}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-400">Бүс нутаг: {currentItem.region}</div>
              <button
                className="text-xs text-blue-600 hover:underline"
                onClick={() => setShowDetails(true)}
              >
                Дэлгэрэнгүй
              </button>
            </div>
          </div>

          {/* Rating */}
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-800">Үнэлгээ өгөх</span>
              <span className="text-xs text-gray-400">
                {memberRating ? `${memberRating}/5` : "Үнэлгээгүй"}
              </span>
            </div>
            <div
              className="mt-2 flex items-center gap-2"
              onMouseLeave={() => setHoverRating(0)}
            >
              {Array.from({ length: STAR_COUNT }).map((_, i) => {
                const starNum = i + 1;
                const active = starNum <= (hoverRating || memberRating);
                return (
                  <button
                    key={i}
                    aria-label={`Үнэлгээ: ${starNum} од`}
                    className={[
                      "w-10 h-10 rounded-md flex items-center justify-center transition-colors",
                      active ? "bg-yellow-100" : "bg-gray-100",
                    ].join(" ")}
                    onClick={() => handleRate(starNum)}
                    onMouseEnter={() => setHoverRating(starNum)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                      <path
                        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.2 3.6a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.73-2.778a.562.562 0 00-.586 0l-4.73 2.778a.562.562 0 01-.84-.61l1.285-5.386a.563.563 0 00-.182-.557l-4.2-3.6a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                        fill={active ? "#F59E0B" : "none"}
                        stroke={active ? "#F59E0B" : "#9CA3AF"}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Progress */}
          <div className="mt-5">
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="mt-4 flex items-center justify-between gap-2">
            <button
              disabled={isAnimating}
              className={[
                "text-sm px-4 py-2 rounded-lg bg-gray-100 text-gray-700 active:scale-[0.98] transition inline-flex items-center gap-1 whitespace-nowrap",
                isAnimating ? "opacity-50 cursor-not-allowed" : ""
              ].join(" ")}
              onClick={goBack}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Буцах
            </button>
            <button
              disabled={isAnimating}
              className={[
                "text-sm px-4 py-2 rounded-lg bg-blue-600 text-white shadow active:scale-[0.98] transition inline-flex items-center gap-1 whitespace-nowrap",
                isAnimating ? "opacity-70 cursor-not-allowed" : ""
              ].join(" ")}
              onClick={goNext}
            >
              Дараах
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {showDetails && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
        >
          <button
            aria-label="Дэлгэрэнгүй хаах"
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowDetails(false)}
          />
          <div className="relative w-full max-w-[375px] mx-4 rounded-2xl bg-white shadow-xl">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-base font-semibold">Гишүүний ажлын дэлгэрэнгүй</h2>
              <button
                className="text-sm text-gray-500 hover:text-gray-700"
                onClick={() => setShowDetails(false)}
              >
                Хаах
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div className="text-xs text-gray-500">
                ID #{currentItem.id} • Бүс нутаг: {currentItem.region}
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1">Товч тайлбар</h3>
                <p className="text-sm text-gray-700">{currentItem.summary}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1">Гол үйл ажиллагаа</h3>
                <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
                  {currentItem.stats.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
              {!!currentItem.details?.length && (
                <div>
                  <h3 className="text-sm font-medium mb-1">Дэлгэрэнгүй</h3>
                  <div className="space-y-2">
                    {currentItem.details.map((d, i) => (
                      <p key={i} className="text-sm text-gray-700 leading-relaxed">
                        {d}
                      </p>
                    ))}
                  </div>
                </div>
              )}
              <div className="text-xs text-gray-500">
                Одоогийн үнэлгээ: {currentRating ? `${currentRating}/5` : "Үнэлгээгүй"}
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end">
              <button
                className="text-sm px-4 py-2 rounded-lg bg-blue-600 text-white shadow active:scale-[0.98] transition"
                onClick={() => setShowDetails(false)}
              >
                Буцах
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
