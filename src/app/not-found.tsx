import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-24 text-center">
      <h1 className="text-4xl font-bold text-[#0B2D5B]">Page Not Found</h1>
      <p className="mt-3 text-[#5A6570]">The page you are looking for does not exist.</p>
      <Link
        href="/"
        className="mt-6 inline-block text-sm font-semibold text-[#2E7D9A] hover:underline"
      >
        Return to homepage →
      </Link>
    </div>
  );
}
