import AppLayout from "@/components/layout/AppLayout";
import SwipeWidget from "@/components/web/widgets/SwipeWidget";
import { FetchNews } from "@/core/scrap";
export default async function page() {
  const data = await FetchNews()
  const sampleData = [
  { id: 1, title: "First item" },
  { id: 2, title: "Second item" },
  { id: 3, title: "Third item" },
];


  return (
    <AppLayout>
      <SwipeWidget data={sampleData}/>
    </AppLayout>
  );
}
