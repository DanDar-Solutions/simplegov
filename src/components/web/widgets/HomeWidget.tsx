"use client";

import NewsFeed from "@/components/web/legits/NewFeeds";
import type { NewsItemType } from "../../../static/news/schema/news"; 

interface HomeWidgetProps {
  news: NewsItemType[]; 
}

export default function HomeWidget({ news }: HomeWidgetProps) {
  return <NewsFeed news={news} />;
}
