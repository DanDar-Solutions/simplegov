"use client";

type ProfileSectionProps = {
  profile: {
    name: string;
    avatarUrl?: string;
    title?: string;
  };
};

export function ProfileSection({ profile }: ProfileSectionProps) {
  return (
    <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-md">
      {/* Avatar */}
      <img
        src={profile.avatarUrl || "/images/default-avatar.png"}
        alt={profile.name}
        className="w-16 h-16 rounded-full object-cover"
      />

      {/* Name and title */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">{profile.name}</h2>
        {profile.title && (
          <p className="text-gray-500 text-sm">{profile.title}</p>
        )}
      </div>
    </div>
  );
}
