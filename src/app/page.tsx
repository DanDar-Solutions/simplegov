import Link from "next/link";

export default function Page() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-500">
      <Link
        href="/swipe"
        className="flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-gray-100 text-lg font-semibold shadow-md hover:bg-green-700 hover:shadow-lg transition-all"
      >
        Go
      </Link>
    </div>
  );
}
