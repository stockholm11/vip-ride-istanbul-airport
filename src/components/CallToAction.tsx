import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PhoneIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import exteriorImage from "../assets/images/vehicles/mercedes-s-class.jpg";

export default function CallToAction() {
  const { t, i18n } = useTranslation();

  // Helper function to add language prefix
  const getLocalizedPath = (path: string) => {
    if (path.match(/^\/(en|tr|ar)\//)) return path;
    return `/${i18n.language}${path}`;
  };

  return (
    <section
      className="relative py-20 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${exteriorImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-primary opacity-85" />

      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t("cta.needHelp")}
          </h2>
          <p className="text-xl mb-8">
            {t("cta.callUs")}{" "}
            <a
              href="tel:+905431568648"
              className="text-secondary font-bold hover:text-secondary-light transition-colors"
            >
              +90 543 156 8648
            </a>{" "}
            {t("cta.orEmail")}{" "}
            <a
              href="mailto:info@viprideistanbulairport.com"
              className="text-secondary hover:text-secondary-dark"
            >
              info@viprideistanbulairport.com
            </a>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+908502550789"
              className="btn-gold px-6 py-4 flex items-center justify-center gap-2"
            >
              <PhoneIcon className="h-5 w-5" />
              <span>+90 543 156 8648</span>
            </a>
            <Link
              to={getLocalizedPath("/contact")}
              className="bg-white text-primary px-6 py-4 flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
            >
              <EnvelopeIcon className="h-5 w-5" />
              <span>{t("nav.contact")}</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
