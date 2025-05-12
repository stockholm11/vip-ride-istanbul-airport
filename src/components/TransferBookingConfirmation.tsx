import { useState, Fragment, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, Transition } from '@headlessui/react';
import {
  XMarkIcon,
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
  UsersIcon,
  BriefcaseIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  EnvelopeIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { TransferFormData } from './TransferBookingForm';
import { Vehicle } from '../data/vehicles';
import { sendBookingConfirmationEmail, generateBookingReference } from '../utils/emailService';
import TransferBookingSuccessModal from './TransferBookingSuccessModal';

// Extend the Vehicle interface to include price property
interface VehicleWithPrice extends Vehicle {
  price?: number;
}

interface TransferBookingConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: VehicleWithPrice | null;
  transferData: TransferFormData | null;
  locations: {
    fromName: string;
    toName: string;
    distance?: number;
    travelTime?: string;
  } | null;
}

export default function TransferBookingConfirmation({
  isOpen,
  onClose,
  vehicle,
  transferData,
  locations
}: TransferBookingConfirmationProps) {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: '',
    paymentMethod: 'cash',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [bookingReference, setBookingReference] = useState('');
  const [emailStatus, setEmailStatus] = useState<'pending' | 'success' | 'error' | null>(null);

  // New state to control the success modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Reset form when modal is reopened
  useEffect(() => {
    if (isOpen && !submitted) {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        specialRequests: '',
        paymentMethod: 'cash',
      });
      setBookingReference('');
      setEmailStatus(null);
      setShowSuccessModal(false);
    }
  }, [isOpen, submitted]);

  if (!vehicle || !transferData || !locations) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Generate a unique booking reference
    const reference = generateBookingReference();
    setBookingReference(reference);

    // Simulate payment processing
    setTimeout(async () => {
      setIsSubmitting(false);
      setSubmitted(true);
      setEmailStatus('success'); // Assume email is sent successfully

      // Show the success modal
      setShowSuccessModal(true);

      // Hide the form dialog
      // Note: We don't completely close it yet, as we want to show the success modal
    }, 1500);
  };

  // Format price - ensures safe handling of undefined values
  const formatPrice = (price: number | undefined) => {
    // Default to 0 if undefined for display purposes
    const safePrice = price !== undefined ? price : 0;

    return new Intl.NumberFormat(i18n.language === 'tr' ? 'tr-TR' : i18n.language === 'ar' ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(safePrice);
  };

  // Get the price from the vehicle, defaulting to 0 if undefined
  const basePrice = vehicle.price || 0;

  // Calculate round trip price if needed
  const roundTripPrice = transferData.roundTrip ? basePrice : 0;

  // Calculate grand total
  const grandTotal = transferData.roundTrip ? basePrice * 2 : basePrice;

  // Prepare booking details for the success modal
  const successBookingDetails = {
    bookingId: bookingReference,
    customerName: `${formData.firstName} ${formData.lastName}`,
    fromLocation: locations.fromName,
    toLocation: locations.toName,
    date: transferData.date,
    time: transferData.time,
    returnDate: transferData.returnDate,
    returnTime: transferData.returnTime,
    roundTrip: !!transferData.roundTrip,
    passengers: transferData.passengers,
    luggage: transferData.luggage,
    totalPrice: grandTotal,
    vehicle: vehicle,
    specialRequests: formData.specialRequests,
    transferType: transferData.transferType || 'airport',
    paymentMethod: formData.paymentMethod as 'creditCard' | 'cash'
  };

  return (
    <>
      <Transition.Root show={isOpen && !showSuccessModal} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={() => {
            // Don't allow closing by clicking outside
            // This prevents accidental closing of the form
            if (submitted) {
              onClose();
            }
          }}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/75" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all">
                  <div className="relative bg-primary text-white py-6 px-6">
                    <Dialog.Title as="h3" className="text-xl font-bold">
                      {t('transfer.confirmBooking')}
                    </Dialog.Title>

                    <button
                      onClick={onClose}
                      className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-white hover:bg-primary-dark"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="p-6">
                    {/* Transfer and Vehicle Details */}
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                      <h4 className="font-semibold text-lg text-primary mb-4">{t('transfer.bookingSummary')}</h4>

                      <div className="space-y-3">
                        {/* Route */}
                        <div className="flex items-center">
                          <MapPinIcon className="h-5 w-5 text-secondary mr-2" />
                          <div className="flex items-center">
                            <span className="font-medium">{locations.fromName}</span>
                            <ArrowRightIcon className="h-4 w-4 mx-2 text-gray-400" />
                            <span className="font-medium">{locations.toName}</span>
                          </div>
                        </div>

                        {/* Distance (if available) */}
                        {locations.distance && (
                          <div className="flex items-center ml-7">
                            <span className="text-gray-600">
                              {t('transfer.actualDistance')}: {locations.distance} km
                            </span>
                          </div>
                        )}

                        {/* Travel Time (if available) */}
                        {locations.travelTime && (
                          <div className="flex items-center ml-7">
                            <ClockIcon className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-gray-600">
                              {t('transfer.estimatedTravelTime')}: {locations.travelTime}
                            </span>
                          </div>
                        )}

                        {/* Date & Time */}
                        <div className="flex items-center">
                          <CalendarIcon className="h-5 w-5 text-secondary mr-2" />
                          <span>{transferData.date} - {transferData.time}</span>
                        </div>

                        {/* Return Trip (if applicable) */}
                        {transferData.roundTrip && transferData.returnDate && transferData.returnTime && (
                          <div className="flex items-center">
                            <CalendarIcon className="h-5 w-5 text-secondary mr-2" />
                            <span className="text-gray-600">{t('transfer.returnTrip')}: {transferData.returnDate} - {transferData.returnTime}</span>
                          </div>
                        )}

                        {/* Passengers & Luggage */}
                        <div className="flex items-center">
                          <UsersIcon className="h-5 w-5 text-secondary mr-2" />
                          <span>{transferData.passengers} {t('transfer.passengers')}, {transferData.luggage} {t('transfer.luggage')}</span>
                        </div>

                        {/* Vehicle */}
                        <div className="flex items-center">
                          <BriefcaseIcon className="h-5 w-5 text-secondary mr-2" />
                          <span>{vehicle.name} ({t(`chauffeur.vehicleTypes.${vehicle.type}`)})</span>
                        </div>

                        {/* Transfer Type */}
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                          <span className="capitalize">
                            {transferData.transferType === 'airport'
                              ? t('nav.airportTransfer')
                              : transferData.transferType === 'intercity'
                                ? t('transfer.intercity')
                                : t('transfer.cityTransfer')}
                          </span>
                        </div>

                      </div>
                    </div>

                    {/* Price Summary */}
                    <div className="border-t border-b py-4 mb-6">
                      <div className="flex justify-between mb-2">
                        <span>{t('transfer.basePrice')}</span>
                        <span>{formatPrice(basePrice)}</span>
                      </div>

                      {transferData.roundTrip && (
                        <div className="flex justify-between mb-2">
                          <span>{t('transfer.returnTrip')}</span>
                          <span>{formatPrice(roundTripPrice)}</span>
                        </div>
                      )}

                      <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
                        <span>{t('transfer.totalPrice')}</span>
                        <span className="text-secondary">{formatPrice(grandTotal)}</span>
                      </div>
                    </div>

                    {/* Booking Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                            {t('booking.firstName')} *
                          </label>
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                            {t('booking.lastName')} *
                          </label>
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            {t('booking.email')} *
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                            {t('booking.phone')} *
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-1">
                          {t('booking.specialRequests')}
                        </label>
                        <textarea
                          id="specialRequests"
                          name="specialRequests"
                          rows={3}
                          value={formData.specialRequests}
                          onChange={handleChange}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50"
                        ></textarea>
                      </div>

                      {/* Payment Method */}
                      <div>
                        <h4 className="text-md font-medium text-gray-700 mb-2">{t('transfer.paymentMethod')}</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <label className={`
                            flex items-center p-3 rounded-lg border-2 cursor-pointer
                            ${formData.paymentMethod === 'cash' ? 'border-secondary bg-secondary/10' : 'border-gray-200 hover:border-gray-300'}
                          `}>
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="cash"
                              checked={formData.paymentMethod === 'cash'}
                              onChange={handleChange}
                              className="h-4 w-4 text-secondary focus:ring-secondary border-gray-300"
                            />
                            <span className="ml-2 text-sm font-medium">{t('transfer.cash')}</span>
                          </label>

                          <label className={`
                            flex items-center p-3 rounded-lg border-2 cursor-not-allowed opacity-50
                            ${formData.paymentMethod === 'creditCard' ? 'border-secondary bg-secondary/10' : 'border-gray-200'}
                          `}>
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="creditCard"
                              checked={formData.paymentMethod === 'creditCard'}
                              onChange={handleChange}
                              disabled
                              className="h-4 w-4 text-secondary focus:ring-secondary border-gray-300 cursor-not-allowed"
                            />
                            <span className="ml-2 text-sm font-medium">{t('transfer.creditCard')}</span>
                          </label>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-600">
                        <p>{t('booking.requiredFields')}</p>
                      </div>

                      <div className="flex justify-end mt-6">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            if (window.confirm(t('booking.confirmCancel'))) {
                              onClose();
                            }
                          }}
                          className="btn btn-outline-primary mr-3"
                        >
                          {t('booking.cancel')}
                        </button>
                        <button
                          type="submit"
                          className="btn btn-secondary btn-md flex items-center justify-center"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              {t('booking.processing')}
                            </>
                          ) : (
                            t('transfer.confirmAndPay')
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Success modal */}
      <TransferBookingSuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          onClose(); // Close the parent modal too
        }}
        bookingDetails={successBookingDetails}
      />
    </>
  );
}
