import AppLayout from "@/components/layout/AppLayout";
import HomeWidget from "@/components/web/widgets/HomeWidget";
import { FetchNews } from "@/core/scrap";
export default async function Home() {
  const news = await FetchNews()
  return (
    <AppLayout>
      <HomeWidget news={news}/>
    </AppLayout>
  );
}
