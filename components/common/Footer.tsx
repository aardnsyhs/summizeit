import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-50 py-10 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-lg font-semibold text-gray-700">SummizeIt</h2>
        <p className="text-sm text-gray-500 mt-2">
          © {new Date().getFullYear()} SummizeIt. All rights reserved.
        </p>
        <div className="flex justify-center gap-6 mt-4">
          <Link
            href="/#pricing"
            className="text-sm text-pink-600 hover:underline"
          >
            Pricing
          </Link>
          <Link
            href="/dashboard"
            className="text-sm text-pink-600 hover:underline"
          >
            Summaries
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
