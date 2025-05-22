import { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog } from "@headlessui/react";
import { CheckCircleIcon, PrinterIcon, EnvelopeIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { isRTL } from "../utils/i18n";

// Animation variants
const dialogAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
};

interface BookingConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  bookingDetails: {
    bookingId: string;
    customerName: string;
    tourName: string;
    date: string;
    time: string;
    guests: number;
    totalPrice: number;
    pickupLocation: string;
    dropoffLocation: string;
  };
}

export default function BookingConfirmation({ isOpen, onClose, bookingDetails }: BookingConfirmationProps) {
  const { t, i18n } = useTranslation();
  const [emailStatus, setEmailStatus] = useState<'pending' | 'success' | 'error' | null>(null);
  const printRef = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);

  // Reset email status when modal is reopened
  useEffect(() => {
    if (isOpen) {
      setEmailStatus(null);
      setSubmitted(false);
    }
  }, [isOpen]);

  // Determine if current language is RTL
  const rtl = isRTL(i18n.language);

  // Format date based on current language
  const formatDate = (dateString: string) => {
    if (!dateString) return '';

    const date = new Date(dateString);

    // Different formats based on language
    const localeMap = {
      en: 'en-GB',
      tr: 'tr-TR',
      ar: 'ar-SA'
    };

    const locale = localeMap[i18n.language as keyof typeof localeMap] || 'en-GB';

    return new Intl.DateTimeFormat(locale, {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  // Format price with currency symbol based on language
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(i18n.language === 'tr' ? 'tr-TR' : i18n.language === 'ar' ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handlePrint = async () => {
    if (!printRef.current) return;

    // Create PDF
    try {
      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: "#ffffff"
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`vip-ride-booking-${bookingDetails.bookingId}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
    }
  };

  const handleEmailConfirmation = async () => {
    try {
      setEmailStatus('pending');
      setSubmitted(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setEmailStatus('success');
      
      // Show success popup
      alert(t("booking.emailSentConfirmation"));
      
      // Close the form after successful email sending
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Error sending email:', error);
      setEmailStatus('error');
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => {
        onClose();
        setEmailStatus(null);
        setSubmitted(false);
      }}
      className="relative z-50"
    >
      {/* Background overlay */}
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel
              as={motion.div}
              variants={dialogAnimation}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={true}
              dir={rtl ? 'rtl' : 'ltr'}
              className="mx-auto max-w-xl w-full bg-white rounded-xl shadow-2xl overflow-hidden relative max-h-[90vh] overflow-y-auto"
            >
              {/* Close button */}
              <button
                onClick={() => {
                  onClose();
                  setEmailStatus(null);
                  setSubmitted(false);
                }}
                className={`absolute top-2 ${rtl ? 'left-2' : 'right-2'} text-gray-400 hover:text-gray-600 transition-colors z-50 bg-white rounded-full p-1 shadow-md`}
              >
                <XMarkIcon className="h-6 w-6" />
              </button>

              {/* Printable content section */}
              <div ref={printRef} className="p-4 bg-white mt-10">
                {/* Logo and header */}
                <div className="flex justify-center mb-4">
                  <div className="text-center">
                    <h1 className="text-lg font-bold text-primary flex items-center justify-center">
                      VIP Ride
                      <span className={`text-sm font-normal text-gray-500 ${rtl ? 'mr-1' : 'ml-1'}`}>
                        {t("general.istanbulAirport")}
                      </span>
                    </h1>
                  </div>
                </div>

                {/* Success message */}
                <div className="text-center mb-4">
                  <div className="flex justify-center mb-2">
                    <CheckCircleIcon className="h-10 w-10 text-green-500" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-800 mb-1">
                    {t("booking.bookingSuccess")}
                  </h2>
                  <p className="text-gray-600 text-xs">
                    {t("booking.confirmationEmail")}
                  </p>
                </div>

                {/* Booking details */}
                <div className="border border-gray-200 rounded-lg p-4 mb-4">
                  <h3 className="text-base font-bold text-primary mb-3 pb-2 border-b">
                    {t("booking.bookingDetails")}
                  </h3>

                  <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">{t("booking.bookingId")}</dt>
                      <dd className="mt-1 text-sm text-gray-900">{bookingDetails.bookingId}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">{t("booking.name")}</dt>
                      <dd className="mt-1 text-sm text-gray-900">{bookingDetails.customerName}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">{t("booking.tour")}</dt>
                      <dd className="mt-1 text-sm text-gray-900">{bookingDetails.tourName}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">{t("booking.date")}</dt>
                      <dd className="mt-1 text-sm text-gray-900">{formatDate(bookingDetails.date)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">{t("booking.time")}</dt>
                      <dd className="mt-1 text-sm text-gray-900">{bookingDetails.time}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">{t("booking.numberOfGuests")}</dt>
                      <dd className="mt-1 text-sm text-gray-900">{bookingDetails.guests}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">{t("chauffeur.booking.pickupLocation")}</dt>
                      <dd className="mt-1 text-sm text-gray-900">{bookingDetails.pickupLocation}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">{t("chauffeur.booking.dropoffLocation")}</dt>
                      <dd className="mt-1 text-sm text-gray-900">{bookingDetails.dropoffLocation}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">{t("payment.total")}</dt>
                      <dd className="mt-1 text-sm text-gray-900">{formatPrice(bookingDetails.totalPrice)}</dd>
                    </div>
                  </dl>
                </div>

                {/* Contact information */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6 text-sm">
                  <p className="font-medium text-gray-800 mb-2">
                    {t("booking.contactInfo")}:
                  </p>
                  <p className="text-gray-600 mb-1">
                    {t("cta.callUs")}: +90 543 156 8648
                  </p>
                  <p className="text-gray-600">
                    Email: info@viprideistanbulairport.com
                  </p>
                </div>

                {/* Thank you message */}
                <div className="text-center text-gray-600 text-sm">
                  <p>{t("booking.thankYouMessage")}</p>
                </div>
              </div>

              {/* Actions - not included in printable area */}
              <div className={`px-6 py-4 bg-gray-50 flex ${rtl ? 'flex-row-reverse' : 'flex-row'} justify-center`}>
                <button
                  onClick={handlePrint}
                  className={`flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors ${rtl ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <PrinterIcon className={`h-5 w-5 ${rtl ? 'ml-2' : 'mr-2'}`} />
                  {t("booking.printPdf")}
                </button>
              </div>
            </Dialog.Panel>
          </div>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
