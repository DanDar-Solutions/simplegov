"use client";

import React, { useEffect, useRef, useState } from "react";

type Member = {
  id: number;
  summary: string;
  stats?: string[];
  region: string;
  details?: string[];
  img?: string;
  negative?: {
    summary?: string;
    details?: string[];
  };
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
  const [isMdUp, setIsMdUp] = useState<boolean>(false);
  const [hasCompleted, setHasCompleted] = useState<boolean>(false);

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
      // Restore completion flag from this session
      const completed = sessionStorage.getItem("sv_voted_all_completed_2028_06_31");
      setHasCompleted(completed === "1");
    } catch {
      // ignore storage issues
    }
  }, [data]);

  const currentItem = data[currentIndex];

  // Refresh avatar whenever the current card changes
  useEffect(() => {
    const id = data[currentIndex]?.id ?? 1;
    const normalizeImagePath = (p?: string): string => {
      if (!p) return "";
      // Allow JSON to specify "public/..." or "/pros/..." or "pros/..."
      const withoutPublic = p.replace(/^public\/+/, "");
      return withoutPublic.startsWith("/") ? withoutPublic : `/${withoutPublic}`;
    };
    setAvatarUrl(normalizeImagePath(data[currentIndex]?.img));
    // Sync current rating to selected card
    setCurrentRating((prev) => (id ? ratings[id] ?? 0 : 0));
    // Clear any transient hover highlight carried over from previous card
    setHoverRating(0);
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
    setHoverRating(0);
    try {
      localStorage.setItem(`sv_rating_${memberId}`, String(stars));
    } catch {
      // ignore storage issues
    }
    // If all members have a rating now, mark completion in this session
    try {
      const allRated = data.every((m) => (nextRatings[m.id] ?? 0) > 0);
      if (allRated) {
        sessionStorage.setItem("sv_voted_all_completed_2028_06_31", "1");
        setHasCompleted(true);
      }
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

  // Track viewport to enable desktop layout without modal
  useEffect(() => {
    try {
      const mq = window.matchMedia("(min-width: 768px)");
      const update = () => setIsMdUp(mq.matches);
      update();
      // Safari compatibility
      // @ts-ignore
      mq.addEventListener ? mq.addEventListener("change", update) : mq.addListener(update);
      return () => {
        // @ts-ignore
        mq.removeEventListener ? mq.removeEventListener("change", update) : mq.removeListener(update);
      };
    } catch {
      // noop
    }
  }, []);

  // Countdown to end of June 2028 (JS Date normalizes 2028-06-31 → 2028-07-01)
  const ElectionCountdown: React.FC = () => {
    // Target date: 2028-06-31 → normalizes to 2028-07-01 (months are 0-based)
    const targetDate = useRef<Date>(new Date(2028, 5, 31, 0, 0, 0));
    const [now, setNow] = useState<number>(() => Date.now());

    useEffect(() => {
      const id = setInterval(() => setNow(Date.now()), 1000);
      return () => clearInterval(id);
    }, []);

    const from = new Date(now); // live "now"
    const to = targetDate.current; // fixed target

    // Helpers using incremental calendar-safe adds to avoid negative months
    const addYears = (d: Date, y: number) => {
      const nd = new Date(d);
      nd.setFullYear(nd.getFullYear() + y);
      return nd;
    };
    const addMonths = (d: Date, m: number) => {
      const nd = new Date(d);
      nd.setMonth(nd.getMonth() + m);
      return nd;
    };

    let years = 0;
    while (addYears(from, years + 1) <= to) years++;
    let anchor = addYears(from, years);

    let months = 0;
    while (addMonths(anchor, months + 1) <= to) months++;
    anchor = addMonths(anchor, months);

    const msDay = 24 * 60 * 60 * 1000;
    const days = Math.floor((to.getTime() - anchor.getTime()) / msDay);
    anchor = new Date(anchor.getTime() + days * msDay);

    let remainderMs = Math.max(0, to.getTime() - anchor.getTime());
    const hours = Math.floor(remainderMs / (60 * 60 * 1000));
    remainderMs %= (60 * 60 * 1000);
    const minutes = Math.floor(remainderMs / (60 * 1000));
    remainderMs %= (60 * 1000);
    const seconds = Math.floor(remainderMs / 1000);

    const counterLabel = `${years} жил ${months} сар ${days} өдөр ${hours} цаг ${minutes} мин ${seconds} сек`;
    const styleVar = (v: number) => ({ ['--value' as any]: v } as React.CSSProperties);

    return (
      <div className="w-full flex justify-center mb-4 md:mb-6">
        <div className="grid grid-flow-col gap-3 md:gap-5 text-center auto-cols-max">
          <div className="flex flex-col p-2 md:p-3 bg-neutral rounded-box text-neutral-content">
            <span className="countdown font-mono text-4xl md:text-5xl">
              <span style={styleVar(years)} aria-live="polite" aria-label={counterLabel}>{years}</span>
            </span>
            years
          </div>
          <div className="flex flex-col p-2 md:p-3 bg-neutral rounded-box text-neutral-content">
            <span className="countdown font-mono text-4xl md:text-5xl">
              <span style={styleVar(months)} aria-live="polite" aria-label={counterLabel}>{months}</span>
            </span>
            months
          </div>
          <div className="flex flex-col p-2 md:p-3 bg-neutral rounded-box text-neutral-content">
            <span className="countdown font-mono text-4xl md:text-5xl">
              <span style={styleVar(days)} aria-live="polite" aria-label={counterLabel}>{days}</span>
            </span>
            days
          </div>
          <div className="flex flex-col p-2 md:p-3 bg-neutral rounded-box text-neutral-content">
            <span className="countdown font-mono text-4xl md:text-5xl">
              <span style={styleVar(hours)} aria-live="polite" aria-label={counterLabel}>{hours}</span>
            </span>
            hours
          </div>
          <div className="flex flex-col p-2 md:p-3 bg-neutral rounded-box text-neutral-content">
            <span className="countdown font-mono text-4xl md:text-5xl">
              <span style={styleVar(minutes)} aria-live="polite" aria-label={counterLabel}>{minutes}</span>
            </span>
            min
          </div>
          <div className="flex flex-col p-2 md:p-3 bg-neutral rounded-box text-neutral-content">
            <span className="countdown font-mono text-4xl md:text-5xl">
              <span style={styleVar(seconds)} aria-live="polite" aria-label={counterLabel}>{seconds}</span>
            </span>
            sec
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="w-full flex justify-center items-center">
      <div className={["relative w-full max-w-[380px] md:max-w-[700px] lg:max-w-[840px]"].join(" ")}>
        {hasCompleted && <ElectionCountdown />}
        <div
          className={[
            "rounded-3xl shadow-xl bg-white p-4 md:p-6 select-none border border-gray-100 relative",
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
            <div className="p-[4px] rounded-full bg-gradient-to-r from-indigo-500/50 via-pink-500/50 to-yellow-500/50">
              <div className="w-[150px] h-[150px] md:w-[180px] md:h-[180px] rounded-full overflow-hidden bg-gray-100 ring-8 ring-white">
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
            <p className="text-sm md:text-base text-gray-800 leading-relaxed break-words">
              {currentItem.summary}
            </p>
            <div className="flex flex-wrap gap-2">
              {(currentItem.stats ?? []).map((s, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-xs md:text-sm break-words leading-tight"
                >
                  {s}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <div className="text-xs md:text-sm text-gray-400">Бүс нутаг: {currentItem.region}</div>
              {!isMdUp && (
                <button
                  className="text-xs md:text-sm text-blue-600 hover:underline"
                  onClick={() => setShowDetails(true)}
                >
                  Дэлгэрэнгүй
                </button>
              )}
            </div>
          </div>

          {/* Inline details for md+ screens */}
          {isMdUp && (
            <div className="mt-4 md:mt-5 grid md:grid-cols-2 gap-4">
              {!!currentItem.details?.length && (
                <div>
                  <h3 className="text-sm md:text-base font-medium mb-1">Дэлгэрэнгүй</h3>
                  <div className="space-y-2">
                    {currentItem.details.map((d, i) => (
                      <p key={i} className="text-sm md:text-base text-gray-700 leading-relaxed">
                        {d}
                      </p>
                    ))}
                  </div>
                </div>
              )}
              {!!currentItem.negative && (
                <div className="rounded-lg border border-red-100 bg-red-50 p-3 md:p-4">
                  <h3 className="text-sm md:text-base font-medium text-red-700 mb-1">Шүүмжлэл</h3>
                  {currentItem.negative.summary && (
                    <p className="text-sm md:text-base text-red-700 mb-2">
                      {currentItem.negative.summary}
                    </p>
                  )}
                  {!!currentItem.negative.details?.length && (
                    <ul className="text-sm md:text-base text-red-700 list-disc pl-5 space-y-1">
                      {currentItem.negative.details.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Rating (hidden after completion) */}
          {!hasCompleted && (
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm md:text-base text-gray-800">Үнэлгээ өгөх</span>
              <span className="text-xs md:text-sm text-gray-400">
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
                      "w-10 h-10 md:w-12 md:h-12 rounded-md flex items-center justify-center transition-colors",
                      active ? "bg-yellow-100" : "bg-gray-100",
                    ].join(" ")}
                    onClick={() => handleRate(starNum)}
                    onMouseEnter={() => setHoverRating(starNum)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="w-6 h-6 md:w-7 md:h-7">
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
          )}

          {/* Progress */}
          <div className="mt-5">
            <div className="h-1.5 md:h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="mt-4 flex items-center justify-between gap-2">
            <button
              disabled={isAnimating}
              className={[
                "text-sm md:text-base px-4 md:px-5 py-2 md:py-2.5 rounded-lg bg-gray-100 text-gray-700 active:scale-[0.98] transition inline-flex items-center gap-1 whitespace-nowrap",
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
                "text-sm md:text-base px-4 md:px-5 py-2 md:py-2.5 rounded-lg bg-blue-600 text-white shadow active:scale-[0.98] transition inline-flex items-center gap-1 whitespace-nowrap",
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
      {showDetails && !isMdUp && (
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
          <div className="relative w-full max-w-[680px] mx-4 rounded-2xl bg-white shadow-xl">
            <div className="p-4 md:p-5 border-b border-gray-100 flex items-center justify-start">
              <h2 className="text-base font-semibold">Гишүүний ажлын дэлгэрэнгүй</h2>
            </div>
            <div className="p-4 md:p-5 space-y-3 md:space-y-4 md:grid md:grid-cols-2 md:gap-4">
              <div className="text-xs md:text-sm text-gray-500">
                ID #{currentItem.id} • Бүс нутаг: {currentItem.region}
              </div>
              <div>
                <h3 className="text-sm md:text-base font-medium mb-1">Товч тайлбар</h3>
                <p className="text-sm md:text-base text-gray-700">{currentItem.summary}</p>
              </div>
              <div>
                <h3 className="text-sm md:text-base font-medium mb-1">Гол үйл ажиллагаа</h3>
                <ul className="text-sm md:text-base text-gray-700 list-disc pl-5 space-y-1">
                  {(currentItem.stats ?? []).map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
              {!!currentItem.details?.length && (
                <div>
                  <h3 className="text-sm md:text-base font-medium mb-1">Дэлгэрэнгүй</h3>
                  <div className="space-y-2">
                    {currentItem.details.map((d, i) => (
                      <p key={i} className="text-sm md:text-base text-gray-700 leading-relaxed">
                        {d}
                      </p>
                    ))}
                  </div>
                </div>
              )}
              {!!currentItem.negative && (
                <div className="rounded-lg border border-red-100 bg-red-50 p-3 md:p-4">
                  <h3 className="text-sm md:text-base font-medium text-red-700 mb-1">Шүүмжлэл</h3>
                  {currentItem.negative.summary && (
                    <p className="text-sm md:text-base text-red-700 mb-2">{currentItem.negative.summary}</p>
                  )}
                  {!!currentItem.negative.details?.length && (
                    <ul className="text-sm md:text-base text-red-700 list-disc pl-5 space-y-1">
                      {currentItem.negative.details.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              <div className="text-xs md:text-sm text-gray-500">
                Одоогийн үнэлгээ: {currentRating ? `${currentRating}/5` : "Үнэлгээгүй"}
              </div>
            </div>
            <div className="p-4 md:p-5 border-t border-gray-100 flex justify-end">
              <button
                className="text-sm md:text-base px-4 md:px-5 py-2 md:py-2.5 rounded-lg bg-blue-600 text-white shadow active:scale-[0.98] transition"
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
