import path from "path";
import { promises as fs } from "fs";
import type { ModernNewsItem } from "@/static/news/modern";

export async function FetchNews(): Promise<ModernNewsItem[]> {
  const filePath = path.join(process.cwd(), "src", "static", "news", "data.json");

  try {
    const fileContents = await fs.readFile(filePath, "utf-8");
    const raw: any[] = JSON.parse(fileContents);

    const news: ModernNewsItem[] = raw.map((it) => {
      const content = typeof it.content === "string" ? it.content : "";
      const plain = content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      const summary = plain.length > 240 ? plain.slice(0, 240) + "..." : plain;

      return {
        id: String(it.id ?? it._id ?? Math.random().toString(36).slice(2, 9)),
        title: String(it.title ?? "Untitled"),
        summary,
        date: String(it.date ?? new Date().toISOString()),
        category: it.category ?? undefined,
        url: it.url ?? undefined,
      };
    });

    return news;
  } catch (err) {
    console.error("[FetchNews] Failed to read or parse JSON:", err);
    return [];
  }
}

export async function getNewsById(id: string): Promise<ModernNewsItem> {
  if (!id || typeof id !== "string") {
    throw new Error("[getNewsById] Invalid ID provided");
  }

  const normalizedId = id.trim();
  const news = await FetchNews();

  const item = news.find((n) => n.id.trim() === normalizedId);
  if (!item) {
    throw new Error(`[getNewsById] News item with ID "${normalizedId}" not found`);
  }

  return item;
}
