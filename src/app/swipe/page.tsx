import SwipeWidget from "@/components/web/widgets/SwipeWidget";
import membersData from "./PM.json";

type Member = {
  id: number;
  summary: string;
  stats: string[];
  region: string;
};

export default async function SwipePage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="w-full max-w-[375px] px-4">
        <SwipeWidget data={membersData as Member[]} />
      </div>
    </div>
  );
}
