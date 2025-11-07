"use client";

import NewsFeed from "@/components/web/legits/NewFeeds";
import type { ModernNewsItem } from "@/static/news/modern";

interface HomeWidgetProps {
  news: ModernNewsItem[];
}

export default function HomeWidget({ news }: HomeWidgetProps) {
  return <NewsFeed news={news} />;
}
