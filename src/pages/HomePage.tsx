import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Hero from "../components/Hero";
import Services from "../components/Services";
import FeaturedTours from "../components/FeaturedTours";
import FeaturedTransfers from "../components/FeaturedTransfers";
import CustomerTestimonials from "../components/CustomerTestimonials";
import CallToAction from "../components/CallToAction";

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <>
      <Hero
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
      >
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 justify-center">
          <Link
            to="/transfer"
            className="btn-gold px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105"
          >
            {t("hero.cta")}
          </Link>
          <Link
            to="/contact"
            className="border-2 border-white bg-transparent px-8 py-4 text-lg font-semibold transition-all duration-300 hover:bg-white hover:text-primary"
          >
            {t("hero.secondaryCta")}
          </Link>
        </div>
      </Hero>
      <Services />
      <FeaturedTransfers />
      <FeaturedTours />
      <CustomerTestimonials />
      <CallToAction />
    </>
  );
}
