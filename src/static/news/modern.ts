export type ModernNewsItem = {
  id: string;
  title: string;
  summary: string; // short plain-text summary or excerpt
  date: string; // ISO date
  category?: string;
  url?: string;
};

export default ModernNewsItem;
