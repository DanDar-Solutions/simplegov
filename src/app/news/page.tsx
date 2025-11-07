import AppLayout from "@/components/layout/AppLayout";
import NewsWidget from "@/components/web/widgets/NewsWidget";
import { FetchNews } from "@/core/scrap";
export default async function Home() {
  const news = await FetchNews()
  return (
    <AppLayout>
      <NewsWidget news={news}/>
    </AppLayout>
  );
}
