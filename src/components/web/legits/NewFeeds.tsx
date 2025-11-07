import type { ModernNewsItem } from "@/static/news/modern";
import NewsItem from "../items/NewsItem";

export interface NewsFeedProps {
  news: ModernNewsItem[];
}

export default function NewsFeed({ news }: NewsFeedProps) {
  return (
    <section className="news-feed divide-y divide-gray-200">
      {news.map((item) => (
        <NewsItem key={item.id} {...item} />
      ))}
    </section>
  );
}
