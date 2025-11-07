import path from "path";
import { promises as fs } from "fs";
import type { NewsItemType } from "@/static/types/news";

export async function FetchNews(): Promise<NewsItemType[]> {
  const filePath = path.join(process.cwd(), "parliament.json");

  try {
    const fileContents = await fs.readFile(filePath, "utf-8");
    const news: NewsItemType[] = JSON.parse(fileContents);
    return news;
  } catch (err) {
    console.error("[FetchNews] Failed to read or parse JSON:", err);
    return [];
  }
}
