import AppLayout from "@/components/layout/AppLayout";
import ProfileWidget from "@/components/web/widgets/ProfileWidget";
import { FetchNews } from "@/core/scrap";
export default async function page() {
  const profile = await FetchNews()
  return (
    <AppLayout>
      <ProfileWidget profile={profile}/>
    </AppLayout>
  );
}
