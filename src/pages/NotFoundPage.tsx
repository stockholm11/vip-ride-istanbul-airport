import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  const { t, i18n } = useTranslation();

  // Helper function to add language prefix
  const getLocalizedPath = (path: string) => {
    if (path.match(/^\/(en|tr|ar)\//)) return path;
    return `/${i18n.language}${path}`;
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="text-center">
        <h1 className="mb-8 text-9xl font-bold text-primary">404</h1>
        <h2 className="mb-8 text-4xl font-semibold text-gray-800">
          Page Not Found
        </h2>
        <p className="mb-8 text-xl text-gray-600">
          The page you are looking for might have been removed or is temporarily
          unavailable.
        </p>
        <Link
          to={getLocalizedPath("/")}
          className="btn-gold inline-block px-8 py-3 font-semibold transition-all hover:scale-105"
        >
          {t('nav.home')}
        </Link>
      </div>
    </div>
  );
}
