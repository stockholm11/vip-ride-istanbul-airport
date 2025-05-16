import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog } from "@headlessui/react";
import { CheckCircleIcon, PrinterIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { isRTL } from "../utils/i18n";
import { Vehicle } from "../data/vehicles";

// Animation variants
const dialogAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
};

interface ChauffeurBookingConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  bookingDetails: {
    bookingId: string;
    customerName: string;
    serviceName?: string;
    date: string;
    time: string;
    duration: number;
    passengers: number;
    totalPrice: number;
    pickupLocation: string;
    dropoffLocation: string;
    specialRequests?: string;
    vehicle: Vehicle;
    paymentMethod: 'creditCard' | 'cash';
    cardNumber?: string;
    cardHolderName?: string;
    expiryDate?: string;
    cvv?: string;
  };
}

export default function ChauffeurBookingConfirmation({ isOpen, onClose, bookingDetails }: ChauffeurBookingConfirmationProps) {
  const { t, i18n } = useTranslation();
  const printRef = useRef<HTMLDivElement>(null);
  const [emailStatus, setEmailStatus] = useState<'pending' | 'success' | 'error' | null>(null);
  const [submitted, setSubmitted] = useState(false);

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
        scale: 1.5,
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
      
      // İçeriği tek sayfaya sığdırmak için ölçeklendirme yapıyoruz
      const scale = pageHeight / imgHeight;
      const scaledImgWidth = imgWidth * scale;
      const scaledImgHeight = imgHeight * scale;
      
      // İçeriği sayfanın ortasına yerleştiriyoruz
      const xOffset = (210 - scaledImgWidth) / 2;
      const yOffset = (297 - scaledImgHeight) / 2;

      pdf.addImage(imgData, 'PNG', xOffset, yOffset, scaledImgWidth, scaledImgHeight);
      pdf.save(`vip-ride-chauffeur-${bookingDetails.bookingId}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
    }
  };

  const handleEmailConfirmation = () => {
    setEmailStatus('pending');
    setSubmitted(true);
    
    // Simulate email sending
    setTimeout(() => {
      setEmailStatus('success');
      // Show success popup
      alert(t("booking.emailSentConfirmation"));
      
      // Close form after 1 second
      setTimeout(() => {
        onClose();
      }, 1000);
    }, 1500);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => {
        // Prevent accidental closing - only allow closing if submitted
        if (submitted) {
          onClose();
        }
      }}
      className="relative z-50"
    >
      {/* Background overlay */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

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
              className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow-xl"
            >
              {/* Printable content section */}
              <div ref={printRef} className="space-y-4 p-4">
                {/* Logo and header */}
                <div className="flex justify-center mb-4">
                  <div className="text-center">
                    <h1 className="text-xl font-bold text-primary flex items-center justify-center">
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
                    <CheckCircleIcon className="h-12 w-12 text-green-500" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 mb-1">
                    {t("booking.bookingSuccess")}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {t("booking.confirmationEmail")}
                  </p>
                </div>

                {/* Booking details */}
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h3 className="font-bold text-gray-800 mb-2 text-sm">
                    {t("booking.bookingReference")}: {bookingDetails.bookingId}
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">{t("chauffeur.booking.serviceName")}:</span>
                      <span className="font-medium">{bookingDetails.serviceName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">{t("chauffeur.booking.date")}:</span>
                      <span className="font-medium">{bookingDetails.date}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">{t("chauffeur.booking.time")}:</span>
                      <span className="font-medium">{bookingDetails.time}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">{t("chauffeur.booking.duration")}:</span>
                      <span className="font-medium">{bookingDetails.duration} {t("chauffeur.hours")}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">{t("chauffeur.booking.passengers")}:</span>
                      <span className="font-medium">{bookingDetails.passengers}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">{t("chauffeur.booking.pickupLocation")}:</span>
                      <span className="font-medium">{bookingDetails.pickupLocation}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">{t("chauffeur.booking.dropoffLocation")}:</span>
                      <span className="font-medium">{bookingDetails.dropoffLocation}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">{t("chauffeur.booking.totalPrice")}:</span>
                      <span className="font-medium">€{bookingDetails.totalPrice}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">{t("chauffeur.booking.paymentMethod")}:</span>
                      <span className="font-medium">{t(`booking.${bookingDetails.paymentMethod}`)}</span>
                    </div>
                  </div>
                </div>

                {/* Location details */}
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h3 className="font-bold text-gray-800 mb-2 text-sm">{t("chauffeur.booking.details")}:</h3>
                  <div className="space-y-2 text-sm">
                    {bookingDetails.specialRequests && (
                      <div>
                        <p className="text-gray-600">{t("chauffeur.booking.specialRequests")}:</p>
                        <p className="font-medium">{bookingDetails.specialRequests}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Information */}
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h3 className="font-bold text-gray-800 mb-2 text-sm">{t("chauffeur.booking.paymentDetails")}:</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t("chauffeur.booking.paymentMethod")}:</span>
                      <span className="font-medium">
                        {bookingDetails.paymentMethod === 'creditCard' ? t("chauffeur.booking.creditCard") : t("chauffeur.booking.cash")}
                      </span>
                    </div>
                    {bookingDetails.paymentMethod === 'creditCard' && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t("chauffeur.booking.cardNumber")}:</span>
                          <span className="font-medium">
                            {bookingDetails.cardNumber ? `**** **** **** ${bookingDetails.cardNumber.slice(-4)}` : ''}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t("chauffeur.booking.cardholderName")}:</span>
                          <span className="font-medium">{bookingDetails.cardHolderName}</span>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t("chauffeur.booking.totalPrice")}:</span>
                      <span className="font-medium">€{bookingDetails.totalPrice}</span>
                    </div>
                  </div>
                </div>

                {/* Contact information */}
                <div className="bg-gray-50 p-4 rounded-lg mb-4 text-sm">
                  <p className="font-medium text-gray-800 mb-2">
                    {t("chauffeur.booking.contactInfo")}:
                  </p>
                  <p className="text-gray-600 mb-1">
                    {t("chauffeur.booking.callUs")}: +90 543 156 8648
                  </p>
                  <p className="text-gray-600">
                    Email: info@viprideistanbul.com
                  </p>
                </div>

                {/* Thank you message */}
                <div className="text-center text-gray-600 text-sm">
                  <p>{t("chauffeur.booking.thankYouMessage")}</p>
                </div>
              </div>

              {/* Actions - not included in printable area */}
              <div className={`px-6 py-4 bg-gray-50 flex ${rtl ? 'flex-row-reverse' : 'flex-row'} justify-between`}>
                <button
                  onClick={handlePrint}
                  className={`flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors ${rtl ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <PrinterIcon className={`h-5 w-5 ${rtl ? 'ml-2' : 'mr-2'}`} />
                  {t("booking.printPdf")}
                </button>
                <button
                  onClick={handleEmailConfirmation}
                  disabled={emailStatus === 'pending'}
                  className={`flex items-center px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary-dark transition-colors ${rtl ? 'flex-row-reverse' : 'flex-row'} ${emailStatus === 'pending' ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <EnvelopeIcon className={`h-5 w-5 ${rtl ? 'ml-2' : 'mr-2'}`} />
                  {emailStatus === 'pending' ? t("booking.sendingEmail") : t("booking.emailConfirmation")}
                </button>
              </div>
            </Dialog.Panel>
          </div>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
