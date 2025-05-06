import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Logo from "./Logo";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const isRTL = i18n.language === 'ar';

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header className="bg-primary shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center">
              <Logo />
            </Link>
            <a
              href="https://online.tursab.org.tr/signin/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-secondary transition-colors text-xs hidden md:block"
            >
              TURSAB Belge No: 14329
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className={`hidden md:flex items-center space-x-8 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
            <Link to="/" className="text-white hover:text-secondary transition-colors">{t("nav.home")}</Link>
            <Link to="/vip-tours" className="text-white hover:text-secondary transition-colors">{t("nav.vipTours")}</Link>
            <Link to="/transfer" className="text-white hover:text-secondary transition-colors">{t("nav.transfer")}</Link>
            <Link to="/chauffeur" className="text-white hover:text-secondary transition-colors">{t("nav.chauffeur")}</Link>
            <Link to="/contact" className="text-white hover:text-secondary transition-colors">{t("nav.contact")}</Link>
            <LanguageSwitcher variant="minimal" />
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white hover:text-secondary transition-colors"
          >
            {isMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 bg-gray-900 rounded-lg p-4 shadow-xl">
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="text-white hover:text-secondary transition-colors py-2 border-b border-gray-700">{t("nav.home")}</Link>
              <Link to="/vip-tours" className="text-white hover:text-secondary transition-colors py-2 border-b border-gray-700">{t("nav.vipTours")}</Link>
              <Link to="/transfer" className="text-white hover:text-secondary transition-colors py-2 border-b border-gray-700">{t("nav.transfer")}</Link>
              <Link to="/chauffeur" className="text-white hover:text-secondary transition-colors py-2 border-b border-gray-700">{t("nav.chauffeur")}</Link>
              <Link to="/contact" className="text-white hover:text-secondary transition-colors py-2 border-b border-gray-700">{t("nav.contact")}</Link>
              <LanguageSwitcher isMobile={true} onLanguageChange={() => setIsMenuOpen(false)} />
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
