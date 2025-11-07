import AppLayout from "@/components/layout/AppLayout";
import ResultWidget from "@/components/web/widgets/ResultWidget";
import { FetchNews } from "@/core/scrap";
export default async function page() {
  const data = await FetchNews()
  return (
    <AppLayout>
      <ResultWidget data={data}/>
    </AppLayout>
  );
}
