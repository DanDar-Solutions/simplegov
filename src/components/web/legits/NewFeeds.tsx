import { NewsItemType } from "@/static/news/schema/news";
import NewsItem from "../items/NewsItem";

export interface NewsFeedProps {
  news: NewsItemType[];
}

export default function NewsFeed({ news }: NewsFeedProps) {
  return (
    <section className="news-feed divide-y divide-gray-200">
      {news.map((item) => (
        <NewsItem key={item.title} {...item} />
      ))}
    </section>
  );
}
