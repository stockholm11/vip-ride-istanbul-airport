import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  UserGroupIcon,
  GlobeAltIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";

export default function Services() {
  const { t, i18n } = useTranslation();

  // Helper function to add language prefix
  const getLocalizedPath = (path: string) => {
    if (path.match(/^\/(en|tr|ar)\//)) return path;
    return `/${i18n.language}${path}`;
  };

  const services = [
    {
      id: "vip-tours",
      title: "services.vipTours",
      description: "services.vipToursDesc",
      icon: <GlobeAltIcon className="h-12 w-12" />,
      url: getLocalizedPath("/vip-tours"),
    },
    {
      id: "airport-transfer",
      title: "services.airportTransfer",
      description: "services.airportTransferDesc",
      icon: <TruckIcon className="h-12 w-12" />,
      url: getLocalizedPath("/transfer"),
    },
    {
      id: "chauffeur",
      title: "services.chauffeur",
      description: "services.chauffeurDesc",
      icon: <UserGroupIcon className="h-12 w-12" />,
      url: getLocalizedPath("/chauffeur"),
    },
  ];

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0 },
    show: { 
      opacity: 1,
      transition: { 
        duration: 0.3
      } 
    },
  };

  return (
    <section className="section bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-4xl font-bold text-primary">
            {t("services.title")}
          </h2>
          <p className="text-lg text-gray-600">
            {t("services.subtitle")}
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((service) => (
            <Link
              key={service.id}
              to={service.url}
              className="block"
            >
              <motion.div
                variants={item}
                className="group rounded-lg bg-white p-8 shadow-md transition-all duration-300 hover:shadow-xl h-full"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-secondary group-hover:text-white">
                  {service.icon}
                </div>
                <h3 className="mb-4 text-xl font-bold text-primary">
                  {t(service.title)}
                </h3>
                <p className="mb-6 text-gray-600">{t(service.description)}</p>
                <div className="inline-flex items-center font-semibold text-secondary transition-colors group-hover:text-secondary-dark">
                  <span>{t("vipTours.viewDetails")}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="ml-2 h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
