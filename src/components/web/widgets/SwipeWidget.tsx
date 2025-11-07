"use client";

import React, { useState } from "react";
import { SwipeItem } from "../items/SwipeItem";

type Item = {
  id: number;
  title: string;
};

export default function SwipeWidget({ data }: { data: Item[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const swiped = (direction: string) => {
    console.log("Swiped:", direction);
    if (direction === "right" && currentIndex < data.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else if (direction === "left" && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const currentItem = data[currentIndex];

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="relative w-[320px] h-[420px] border">


        <div className="absolute -bottom-10 w-full text-center text-gray-500 text-sm">
          Card {currentIndex + 1} / {data.length}
        </div>
      </div>
    </div>
  );
}
