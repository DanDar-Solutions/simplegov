import React from "react";

// Define the shape of a single news item
interface NewsItem {
  id: string | number;
  title: string;
  description?: string;
  url?: string;
}

// Props interface
interface NewsFeedProps {
  news: NewsItem[];
}

const NewsFeed: React.FC<NewsFeedProps> = ({ news }) => {
  if (!news || news.length === 0) {
    return <div>No news available.</div>;
  }

  return (
    <div className="news-feed">
      {news.map((item) => (
        <div key={item.id} className="news-item">
          <h3>{item.title}</h3>
          {item.description && <p>{item.description}</p>}
          {item.url && (
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              Read more
            </a>
          )}
        </div>
      ))}
    </div>
  );
};

export default NewsFeed;
