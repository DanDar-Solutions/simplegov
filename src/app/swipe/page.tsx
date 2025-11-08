import React from "react";
import SwipeWidget from "@/components/web/widgets/SwipeWidget";
import membersData from "./PM.json";
import AppLayout from "@/components/layout/AppLayout";

type Member = {
  id: number;
  summary: string;
  stats?: string[];
  region: string;
  details?: string[];
  img?: string;
  negative?: {
    summary: string;
    details: string[];
  };
};

export default function SwipePage() {
  return (
    <AppLayout>
      <div className="min-h-screen w-full flex items-center justify-center py-6 md:py-10">
        <div className="w-full max-w-[380px] md:max-w-[760px] lg:max-w-[900px] px-4 md:px-6">
          <SwipeWidget data={(membersData as Member[]).slice(0, 10)} />
        </div>
      </div>
    </AppLayout>
  );
}
