"use client";

import ProfileInformation1 from "../legits/ProfileInformation1";
import ProfileInformation2 from "../legits/ProfileInformation2";
import { ProfileSection } from "../legits/ProfileSection";

type ProfileWidgetProps = {
  profile: {
    name: string;
    avatarUrl?: string;
    // Add other profile fields here
  };
  infoItems?: { id: string | number; label: string; value: string }[];
};

export default function ProfileWidget({
  profile,
  infoItems = [],
}: ProfileWidgetProps) {
  return (
    <section className="max-w-4xl mx-auto p-4">
      <ProfileSection profile={profile} />
      <div className="mt-6 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6">
        <div>
          <ProfileInformation1 profile={profile} />
        </div>
        <div className="space-y-4">
          {infoItems.map((item) => (
            <ProfileInformation2 key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
