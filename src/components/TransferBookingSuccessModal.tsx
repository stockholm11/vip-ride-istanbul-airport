import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog } from "@headlessui/react";
import { CheckCircleIcon, PrinterIcon, EnvelopeIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { isRTL } from "../utils/i18n";
import { TransferFormData } from "./TransferBookingForm";
import { Vehicle } from "../data/vehicles";

// Animation variants
const dialogAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
};

interface TransferBookingDetails {
  bookingId: string;
  customerName: string;
  fromLocation: string;
  toLocation: string;
  date: string;
  time: string;
  returnDate?: string;
  returnTime?: string;
  roundTrip: boolean;
  passengers: number;
  luggage: number;
  vehicle: {
    name: string;
    image: string;
  };
  totalPrice: number;
  transferType: string;
  specialRequests?: string;
  paymentMethod: 'creditCard' | 'cash';
}

interface TransferBookingSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingDetails: TransferBookingDetails;
}

export default function TransferBookingSuccessModal({
  isOpen,
  onClose,
  bookingDetails
}: TransferBookingSuccessModalProps) {
  const { t, i18n } = useTranslation();
  const printRef = useRef<HTMLDivElement>(null);

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

  // Get service name based on transfer type
  const getServiceName = (transferType: string) => {
    switch (transferType) {
      case 'airport':
        return t('nav.airportTransfer');
      case 'intercity':
        return t('nav.intercityTransfer');
      case 'city':
        return t('nav.cityTransfer');
      default:
        return t('transfer.transfer');
    }
  };

  const handlePrint = async () => {
    if (!printRef.current) return;

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
      pdf.save(`vip-ride-transfer-${bookingDetails.bookingId}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
    }
  };

  const handleEmailConfirmation = () => {
    // In a real app, this would trigger a server-side email sending function
    alert(t("booking.emailSentConfirmation"));
    onClose(); // Only close after email is sent
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => {
        // Prevent accidental closing - do nothing
        // The user must explicitly click a button to close
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
                onClick={onClose}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors z-50 bg-white rounded-full p-1 shadow-md"
                aria-label="Close"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>

              {/* Printable content section */}
              <div ref={printRef} className="space-y-3 p-3 mt-10">
                {/* Logo and header */}
                <div className="flex justify-center mb-2">
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
                <div className="text-center mb-3">
                  <div className="flex justify-center mb-1">
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
                <div className="bg-gray-50 p-3 rounded-lg mb-3">
                  <h3 className="font-bold text-gray-800 mb-2 text-xs">
                    {t("booking.bookingReference")}: {bookingDetails.bookingId}
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-gray-600">{t("booking.name")}:</p>
                      <p className="font-medium">{bookingDetails.customerName}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">{t("booking.service")}:</p>
                      <p className="font-medium">{getServiceName(bookingDetails.transferType)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">{t("booking.date")}:</p>
                      <p className="font-medium">{formatDate(bookingDetails.date)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">{t("booking.time")}:</p>
                      <p className="font-medium">{bookingDetails.time}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">{t("booking.vehicle")}:</p>
                      <p className="font-medium">{bookingDetails.vehicle.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">{t("transfer.passengers")}:</p>
                      <p className="font-medium">{bookingDetails.passengers}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">{t("payment.total")}:</p>
                      <p className="font-medium">{formatPrice(bookingDetails.totalPrice)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">{t("transfer.paymentMethod")}:</p>
                      <p className="font-medium">
                        {bookingDetails.paymentMethod === 'creditCard' ? t("transfer.creditCard") : t("transfer.cash")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Location details */}
                <div className="bg-gray-50 p-3 rounded-lg mb-3">
                  <h3 className="font-bold text-gray-800 mb-2 text-xs">{t("transfer.bookingSummary")}:</h3>
                  <div className="space-y-2 text-xs">
                    <div>
                      <p className="text-gray-600">{t("transfer.fromLocation")}:</p>
                      <p className="font-medium">{bookingDetails.fromLocation}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">{t("transfer.toLocation")}:</p>
                      <p className="font-medium">{bookingDetails.toLocation}</p>
                    </div>
                    {bookingDetails.specialRequests && (
                      <div>
                        <p className="text-gray-600">{t("booking.specialRequests")}:</p>
                        <p className="font-medium">{bookingDetails.specialRequests}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact information */}
                <div className="bg-gray-50 p-3 rounded-lg mb-3 text-xs">
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
                <div className="text-center text-gray-600 text-xs">
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
