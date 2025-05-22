import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon
} from "@heroicons/react/24/outline";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaWhatsapp
} from "react-icons/fa";
import Logo from "./Logo";

export default function Footer() {
  const { t, i18n } = useTranslation();
  const currentYear = new Date().getFullYear();

  // Helper function to get localized path
  const getLocalizedPath = (path: string) => {
    // If the path already has a language prefix, return it as is
    if (path.match(/^\/(en|tr|ar)\//)) {
      return path;
    }
    // Otherwise, add the current language prefix
    return `/${i18n.language}${path}`;
  };

  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        {/* Main Footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 gap-y-12 mb-12">
          {/* Column 1: About */}
          <div>
            <Logo className="mb-6" />
            <p className="text-gray-300 mb-6">
              {t('footer.about')}
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-secondary transition-colors"
                aria-label="Facebook"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-secondary transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="https://instagram.com/viprideistanbul"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-secondary transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="https://wa.me/905431568648"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-secondary transition-colors"
                aria-label="WhatsApp"
              >
                <FaWhatsapp size={20} />
              </a>
            </div>
            <a
              href="/tursab.png"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-secondary transition-colors mt-4 inline-block"
            >
              A Grubu Seyahat Acentası Belgesi
            </a>
            <a
              href="/B2.png"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-secondary transition-colors mt-2 inline-block block"
            >
              B2 Yurt içi ve Uluslar Arası Yolcu Taşıma Yetki Belgesi
            </a>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h5 className="text-secondary mb-4 text-xl font-bold">
              {t('footer.quickLinks')}
            </h5>
            <ul className="space-y-3">
              <li>
                <Link
                  to={getLocalizedPath('/')}
                  className="text-gray-300 hover:text-secondary transition-colors inline-block"
                >
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link
                  to={getLocalizedPath('/vip-tours')}
                  className="text-gray-300 hover:text-secondary transition-colors inline-block"
                >
                  {t('nav.vipTours')}
                </Link>
              </li>
              <li>
                <Link
                  to={getLocalizedPath('/transfer')}
                  className="text-gray-300 hover:text-secondary transition-colors inline-block"
                >
                  {t('nav.transfer')}
                </Link>
              </li>
              <li>
                <Link
                  to={getLocalizedPath('/chauffeur')}
                  className="text-gray-300 hover:text-secondary transition-colors inline-block"
                >
                  {t('nav.chauffeur')}
                </Link>
              </li>
              <li>
                <Link
                  to={getLocalizedPath('/contact')}
                  className="text-gray-300 hover:text-secondary transition-colors inline-block"
                >
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h5 className="text-secondary mb-4 text-xl font-bold">
              {t('footer.ourServices')}
            </h5>
            <ul className="space-y-3">
              <li>
                <Link
                  to={getLocalizedPath('/vip-tours')}
                  className="text-gray-300 hover:text-secondary transition-colors inline-block"
                >
                  {t('services.vipTours')}
                </Link>
              </li>
              <li>
                <Link
                  to={getLocalizedPath('/transfer')}
                  className="text-gray-300 hover:text-secondary transition-colors inline-block"
                >
                  {t('services.airportTransfer')}
                </Link>
              </li>
              <li>
                <Link
                  to={getLocalizedPath('/transfer')}
                  className="text-gray-300 hover:text-secondary transition-colors inline-block"
                >
                  {t('nav.cityTransfer')}
                </Link>
              </li>
              <li>
                <Link
                  to={getLocalizedPath('/transfer')}
                  className="text-gray-300 hover:text-secondary transition-colors inline-block"
                >
                  {t('services.intercityTransfer')}
                </Link>
              </li>
              <li>
                <Link
                  to={getLocalizedPath('/chauffeur')}
                  className="text-gray-300 hover:text-secondary transition-colors inline-block"
                >
                  {t('services.chauffeur')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h5 className="text-secondary mb-4 text-xl font-bold">
              {t('footer.contactUs')}
            </h5>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPinIcon className="h-6 w-6 text-secondary mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-300">
                  Etiler Mah. Nisbetiye Cd. Birlik Sk. <br />
                  No: 24 D:4 Beşiktaş, Istanbul / Turkey
                </span>
              </li>
              <li className="flex items-center">
                <PhoneIcon className="h-5 w-5 text-secondary mr-3 flex-shrink-0" />
                <a
                  href="tel:+905431568648"
                  className="text-gray-300 hover:text-secondary transition-colors"
                >
                  +90 543 156 8648
                </a>
              </li>
              <li className="flex items-center">
                <EnvelopeIcon className="h-5 w-5 text-secondary mr-3 flex-shrink-0" />
                <a
                  href="mailto:info@viprideistanbulairport.com"
                  className="text-gray-300 hover:text-secondary transition-colors"
                >
                  info@viprideistanbulairport.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="py-8 border-t border-gray-800">
          <div className="max-w-3xl mx-auto text-center">
            <h5 className="text-xl text-secondary mb-3">{t('footer.newsletter')}</h5>
            <p className="text-gray-400 mb-6">
              {t('footer.newsletterText')}
            </p>
            <form className="flex flex-col sm:flex-row gap-3 justify-center">
              <input
                type="email"
                placeholder={t('footer.emailPlaceholder')}
                className="px-4 py-3 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-secondary w-full sm:w-auto sm:flex-1 max-w-md"
                aria-label={t('footer.emailPlaceholder')}
              />
              <button
                type="submit"
                className="btn-gold py-3 px-6 rounded-md font-semibold transition-colors"
              >
                {t('footer.subscribe')}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="pt-8 border-t border-gray-800 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-6 md:mb-0 text-center md:text-left">
              © {currentYear} VIP Ride Istanbul Airport. {t('footer.rightsReserved')}
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 items-center">
              <Link
                to={getLocalizedPath('/privacy-policy')}
                className="text-gray-400 hover:text-secondary transition-colors text-sm"
              >
                {t('footer.privacyPolicy')}
              </Link>
              <Link
                to={getLocalizedPath('/terms-conditions')}
                className="text-gray-400 hover:text-secondary transition-colors text-sm"
              >
                {t('footer.termsConditions')}
              </Link>
              <Link
                to={getLocalizedPath('/cancellation-policy')}
                className="text-gray-400 hover:text-secondary transition-colors text-sm"
              >
                {t('footer.cancellationPolicy')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
