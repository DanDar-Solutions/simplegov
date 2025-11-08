"use client";

import NewsFeed from "@/components/web/legits/NewFeeds";
import type { ModernNewsItem } from "@/static/news/modern";
import { MicrophoneIcon } from '@heroicons/react/24/solid';

interface HomeWidgetProps {
  news: ModernNewsItem[];
}

export default function HomeWidget({ news }: HomeWidgetProps) {
  return (
    <>
      {/* add some big microphone logo */}
      <div className="flex flex-col items-center gap-8 mt-10">
        <MicrophoneIcon className="w-16 h-16 text-red-600 border rounded-full p-2 " />
        <NewsFeed news={news} />
      </div>
    </>
);
}
