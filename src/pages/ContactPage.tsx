import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

export default function ContactPage() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic would go here
    console.log("Form submitted:", formData);
    // Reset form after submission
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
    });
    alert("Thank you for contacting us. We'll get back to you soon!");
  };

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h1 className="mb-4 text-4xl font-bold text-primary">
            {t("contact.title")}
          </h1>
          <p className="text-lg text-gray-600">
            {t("contact.subtitle")}
          </p>
        </div>

        <div className="grid gap-16 md:grid-cols-2">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-lg bg-white p-8 shadow-lg"
          >
            <h2 className="mb-6 text-2xl font-bold text-primary">
              {t("contact.title")}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  {t("contact.name")}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-4 py-3 focus:border-secondary focus:outline-none"
                  required
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  {t("contact.email")}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-4 py-3 focus:border-secondary focus:outline-none"
                  required
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  {t("contact.phone")}
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-4 py-3 focus:border-secondary focus:outline-none"
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  {t("contact.message")}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-4 py-3 focus:border-secondary focus:outline-none"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="btn-gold px-8 py-3 font-medium"
              >
                {t("contact.send")}
              </button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h2 className="mb-6 text-2xl font-bold text-primary">
                {t("footer.contactUs")}
              </h2>
              <div className="space-y-6">
                <div className="flex">
                  <MapPinIcon className="h-6 w-6 text-secondary mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">
                      {t("contact.address")}
                    </h3>
                    <p className="text-gray-600">
                      Etiler Mah. Nisbetiye Cd. Birlik Sk. <br />
                      No: 24 D:4 Beşiktaş, Istanbul / Turkey
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <PhoneIcon className="h-6 w-6 text-secondary mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">
                      {t("contact.phone")}
                    </h3>
                    <p className="text-gray-600">
                      <a href="tel:+908502550789">+90 850 255 0789</a>
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <EnvelopeIcon className="h-6 w-6 text-secondary mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">
                      {t("contact.email")}
                    </h3>
                    <p className="text-gray-600">
                      <a href="mailto:info@viprideistanbul.com">
                        info@viprideistanbul.com
                      </a>
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <ClockIcon className="h-6 w-6 text-secondary mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">
                      {t("contact.workingHours")}
                    </h3>
                    <p className="text-gray-600">{t("contact.mondayFriday")}</p>
                    <p className="text-gray-600">
                      {t("contact.saturdaySunday")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps */}
            <div className="h-80 w-full overflow-hidden rounded-lg shadow-md">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3007.6764905600637!2d29.024961076742706!3d41.07533141549238!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab604e37cd29d%3A0xe12d1de74181c055!2sEtiler%2C%20Nisbetiye%20Cd.%2C%2034337%20Be%C5%9Fikta%C5%9F%2F%C4%B0stanbul%2C%20Turkey!5e0!3m2!1sen!2sus!4v1711302200957!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="VIP Ride Istanbul Airport Location"
              ></iframe>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
