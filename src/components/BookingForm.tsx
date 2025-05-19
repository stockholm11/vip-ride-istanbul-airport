import { useState, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, CalendarIcon, UserGroupIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';
import { TourType } from './TourCard';
import BookingConfirmation from './BookingConfirmation';

interface BookingFormProps {
  isOpen: boolean;
  onClose: () => void;
  tour: TourType | null;
}

export default function BookingForm({ isOpen, onClose, tour }: BookingFormProps) {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: 1,
    specialRequests: '',
    paymentMethod: 'cash',
    cardNumber: '',
    cardHolderName: '',
    expiryDate: '',
    cvv: '',
    billingAddress: '',
    billingCity: '',
    billingCountry: '',
    billingZipCode: '',
    pickupLocation: '',
    dropoffLocation: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    bookingId: '',
    customerName: '',
    tourName: '',
    date: '',
    time: '',
    guests: 0,
    totalPrice: 0,
    pickupLocation: '',
    dropoffLocation: ''
  });

  if (!tour) return null;

  // Add validation function for date and time
  const isDateTimeValid = (selectedDate: string, selectedTime: string) => {
    const now = new Date();
    const selectedDateTime = new Date(`${selectedDate}T${selectedTime}`);
    
    // Add 1 hour buffer to prevent bookings too close to current time
    const bufferTime = new Date(now.getTime() + 60 * 60 * 1000);
    
    return selectedDateTime >= bufferTime;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Special handling for date and time validation
    if (name === 'date' || name === 'time') {
      const newDate = name === 'date' ? value : formData.date;
      const newTime = name === 'time' ? value : formData.time;
      
      if (newDate && newTime) {
        if (!isDateTimeValid(newDate, newTime)) {
          alert(t('booking.invalidDateTime'));
          return;
        }
      }
    }
    
    // Special handling for expiry date formatting
    if (name === 'expiryDate') {
      const formattedValue = value
        .replace(/\D/g, '')
        .replace(/^(\d{2})/, '$1/')
        .substring(0, 5);
      setFormData(prev => ({ ...prev, [name]: formattedValue }));
      return;
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    // Tüm zorunlu alanları kontrol et
    const requiredFields = {
      firstName: t('booking.firstName'),
      lastName: t('booking.lastName'),
      email: t('booking.email'),
      phone: t('booking.phone'),
      date: t('booking.date'),
      time: t('booking.time'),
      guests: t('booking.numberOfGuests'),
      pickupLocation: t('chauffeur.booking.pickupLocation'),
      dropoffLocation: t('chauffeur.booking.dropoffLocation')
    };

    // Boş alanları bul
    const emptyFields = Object.entries(requiredFields)
      .filter(([key]) => !formData[key as keyof typeof formData]);

    // Eğer boş alan varsa uyarı göster
    if (emptyFields.length > 0) {
      alert(t('booking.requiredFields'));
      return;
    }

    // Tarih ve saat kontrolü
    if (!isDateTimeValid(formData.date, formData.time)) {
      alert(t('booking.invalidDateTime'));
      return;
    }

    setCurrentStep(2);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!tour) {
      alert(t('booking.tourNotFound'));
      setIsSubmitting(false);
      return;
    }

    try {
      // Kart numarasından boşlukları kaldır
      const cardNumber = formData.cardNumber.replace(/\s/g, '');

      // Prepare payment data for iyzico
      const paymentData = {
        locale: 'tr',
        conversationId: `TOUR-${Date.now()}`,
        price: (tour.price * formData.guests).toString(),
        paidPrice: (tour.price * formData.guests).toString(),
        currency: 'EUR',
        installment: '1',
        basketId: `TOUR-${Date.now()}`,
        paymentChannel: 'WEB',
        paymentGroup: 'PRODUCT',
        paymentCard: {
          cardHolderName: formData.cardHolderName,
          cardNumber: cardNumber,
          expireMonth: formData.expiryDate.split('/')[0],
          expireYear: `20${formData.expiryDate.split('/')[1]}`,
          cvc: formData.cvv
        },
        buyer: {
          id: `TOUR-${Date.now()}`,
          name: formData.firstName,
          surname: formData.lastName,
          gsmNumber: formData.phone,
          email: formData.email,
          identityNumber: '11111111111',
          lastLoginDate: formatDateForIyzico(new Date()),
          registrationDate: formatDateForIyzico(new Date()),
          registrationAddress: formData.billingAddress,
          ip: '85.34.78.112',
          city: formData.billingCity,
          country: formData.billingCountry,
          zipCode: formData.billingZipCode
        },
        shippingAddress: {
          contactName: `${formData.firstName} ${formData.lastName}`,
          city: formData.billingCity,
          country: formData.billingCountry,
          address: formData.billingAddress,
          zipCode: formData.billingZipCode
        },
        billingAddress: {
          contactName: `${formData.firstName} ${formData.lastName}`,
          city: formData.billingCity,
          country: formData.billingCountry,
          address: formData.billingAddress,
          zipCode: formData.billingZipCode
        },
        basketItems: [
          {
            id: `TOUR-${Date.now()}`,
            name: tour.title,
            category1: 'Tour',
            itemType: 'PHYSICAL',
            price: (tour.price * formData.guests).toString()
          }
        ],
        // Rezervasyon detaylarını ekle
        bookingDetails: {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          serviceName: tour.title,
          date: formData.date,
          time: formData.time,
          pickupLocation: formData.pickupLocation,
          dropoffLocation: formData.dropoffLocation,
          totalPrice: tour.price * formData.guests,
          bookingReference: `TOUR-${Date.now()}`
        }
      };

      const response = await fetch('http://localhost:3000/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData)
      });

      const result = await response.json();

      if (result.status === 'success') {
        setBookingDetails({
          bookingId: paymentData.bookingDetails.bookingReference,
          customerName: `${formData.firstName} ${formData.lastName}`,
          tourName: tour.title,
          date: formData.date,
          time: formData.time,
          guests: formData.guests,
          totalPrice: tour.price * formData.guests,
          pickupLocation: formData.pickupLocation,
          dropoffLocation: formData.dropoffLocation
        });
        setShowConfirmation(true);
      } else {
        alert(t('payment.paymentFailed'));
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert(t('payment.paymentError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to format date for iyzico
  const formatDateForIyzico = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleClose = () => {
    // Form verilerini sıfırla
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      date: '',
      time: '',
      guests: 1,
      specialRequests: '',
      paymentMethod: 'cash',
      cardNumber: '',
      cardHolderName: '',
      expiryDate: '',
      cvv: '',
      billingAddress: '',
      billingCity: '',
      billingCountry: '',
      billingZipCode: '',
      pickupLocation: '',
      dropoffLocation: ''
    });
    // Adımı sıfırla
    setCurrentStep(1);
    // Modalı kapat
    onClose();
  };

  // Calculate min date (today)
  const today = new Date().toISOString().split('T')[0];

  // If confirmation is showing, render the confirmation component
  if (showConfirmation) {
    return (
      <BookingConfirmation
        isOpen={showConfirmation}
        onClose={handleClose}
        bookingDetails={bookingDetails}
      />
    );
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
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
                    {t('booking.book')} {tour.title}
                  </Dialog.Title>

                  <button
                    onClick={handleClose}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-white hover:bg-primary-dark"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {currentStep === 1 ? (
                      <>
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                              {t('booking.date')} *
                            </label>
                            <input
                              type="date"
                              id="date"
                              name="date"
                              value={formData.date}
                              onChange={handleChange}
                              min={today}
                              required
                              className="w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50"
                            />
                          </div>
                          <div>
                            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                              {t('booking.time')} *
                            </label>
                            <div className="relative">
                              <select
                                id="time"
                                name="time"
                                value={formData.time}
                                onChange={handleChange}
                                required
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50"
                              >
                                <option value="">{t('booking.selectTime')}</option>
                                {Array.from({ length: 24 }).map((_, i) => (
                                  <option key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                                    {`${i.toString().padStart(2, '0')}:00`}
                                  </option>
                                ))}
                              </select>
                              <ClockIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="pickupLocation" className="block text-sm font-medium text-gray-700 mb-1">
                              {t('chauffeur.booking.pickupLocation')} *
                            </label>
                            <input
                              type="text"
                              id="pickupLocation"
                              name="pickupLocation"
                              value={formData.pickupLocation}
                              onChange={handleChange}
                              required
                              className="w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50"
                            />
                          </div>
                          <div>
                            <label htmlFor="dropoffLocation" className="block text-sm font-medium text-gray-700 mb-1">
                              {t('chauffeur.booking.dropoffLocation')} *
                            </label>
                            <input
                              type="text"
                              id="dropoffLocation"
                              name="dropoffLocation"
                              value={formData.dropoffLocation}
                              onChange={handleChange}
                              required
                              className="w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50"
                            />
                          </div>
                        </div>

                        <div className="relative">
                          <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">
                            {t('booking.numberOfGuests')} *
                          </label>
                          <div className="relative">
                            <select
                              id="guests"
                              name="guests"
                              value={formData.guests}
                              onChange={handleChange}
                              className="w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50 pr-10"
                              required
                            >
                              {[...Array(tour.capacity)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>
                                  {i + 1} {i === 0 ? t('booking.guest') : t('booking.guests')}
                                </option>
                              ))}
                            </select>
                            <UserGroupIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
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

                        <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-600">
                          <p>{t('booking.requiredFields')}</p>
                        </div>

                        <div className="flex justify-end mt-6">
                          <button
                            type="button"
                            onClick={handleClose}
                            className="mr-3 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                          >
                            {t('booking.cancel')}
                          </button>
                          <button
                            type="button"
                            onClick={handleNext}
                            className="btn-gold px-6 py-2"
                          >
                            {t('booking.continue')}
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Tour Summary */}
                        <div className="bg-gray-50 p-4 rounded-lg mb-6">
                          <h4 className="font-semibold text-lg text-primary mb-4">{t('booking.bookingSummary')}</h4>

                          <div className="space-y-3">
                            {/* Tour Name */}
                            <div className="flex items-center">
                              <MapPinIcon className="h-5 w-5 text-secondary mr-2" />
                              <span className="font-medium">{tour.title}</span>
                            </div>

                            {/* Date & Time */}
                            <div className="flex items-center">
                              <CalendarIcon className="h-5 w-5 text-secondary mr-2" />
                              <span>{formData.date} - {formData.time}</span>
                            </div>

                            {/* Pickup & Dropoff Locations */}
                            <div className="flex items-center">
                              <MapPinIcon className="h-5 w-5 text-secondary mr-2" />
                              <span>{formData.pickupLocation} - {formData.dropoffLocation}</span>
                            </div>

                            {/* Guests */}
                            <div className="flex items-center">
                              <UserGroupIcon className="h-5 w-5 text-secondary mr-2" />
                              <span>{formData.guests} {formData.guests === 1 ? t('booking.guest') : t('booking.guests')}</span>
                            </div>

                            {/* Duration */}
                            <div className="flex items-center">
                              <ClockIcon className="h-5 w-5 text-secondary mr-2" />
                              <span>{tour.duration}</span>
                            </div>
                          </div>
                        </div>

                        {/* Price Summary */}
                        <div className="border-t border-b py-4 mb-6">
                          <div className="flex justify-between font-bold text-lg">
                            <span>{t('booking.totalPrice')}</span>
                            <span className="text-secondary">{tour.price * formData.guests} €</span>
                          </div>
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
                              flex items-center p-3 rounded-lg border-2 cursor-pointer
                              ${formData.paymentMethod === 'creditCard' ? 'border-secondary bg-secondary/10' : 'border-gray-200 hover:border-gray-300'}
                            `}>
                              <input
                                type="radio"
                                name="paymentMethod"
                                value="creditCard"
                                checked={formData.paymentMethod === 'creditCard'}
                                onChange={handleChange}
                                className="h-4 w-4 text-secondary focus:ring-secondary border-gray-300"
                              />
                              <span className="ml-2 text-sm font-medium">{t('transfer.creditCard')}</span>
                            </label>
                          </div>
                        </div>

                        {formData.paymentMethod === 'creditCard' && (
                          <div className="space-y-4">
                            <div>
                              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                {t('payment.cardNumber')} *
                              </label>
                              <input
                                type="text"
                                id="cardNumber"
                                name="cardNumber"
                                value={formData.cardNumber}
                                onChange={handleChange}
                                required={formData.paymentMethod === 'creditCard'}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50"
                              />
                            </div>

                            <div>
                              <label htmlFor="cardHolderName" className="block text-sm font-medium text-gray-700 mb-1">
                                {t('payment.cardholderName')} *
                              </label>
                              <input
                                type="text"
                                id="cardHolderName"
                                name="cardHolderName"
                                value={formData.cardHolderName}
                                onChange={handleChange}
                                required={formData.paymentMethod === 'creditCard'}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50"
                                placeholder="JOHN DOE"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                                  {t('payment.expiryDate')} *
                                </label>
                                <input
                                  type="text"
                                  id="expiryDate"
                                  name="expiryDate"
                                  value={formData.expiryDate}
                                  onChange={handleChange}
                                  required={formData.paymentMethod === 'creditCard'}
                                  placeholder="MM/YY"
                                  maxLength={5}
                                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50"
                                />
                              </div>
                              <div>
                                <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                                  {t('payment.cvv')} *
                                </label>
                                <input
                                  type="text"
                                  id="cvv"
                                  name="cvv"
                                  value={formData.cvv}
                                  onChange={handleChange}
                                  required={formData.paymentMethod === 'creditCard'}
                                  placeholder="123"
                                  maxLength={4}
                                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Add Billing Address section after contact information */}
                        <div className="border-t pt-6 mt-6">
                          <h4 className="text-lg font-semibold mb-4">{t("payment.billingAddress")}</h4>
                          
                          <div>
                            <label htmlFor="billingAddress" className="block text-sm font-medium text-gray-700 mb-1">
                              {t("payment.address")} *
                            </label>
                            <input
                              type="text"
                              id="billingAddress"
                              name="billingAddress"
                              value={formData.billingAddress}
                              onChange={handleChange}
                              className="w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50 py-2"
                              required
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div>
                              <label htmlFor="billingCity" className="block text-sm font-medium text-gray-700 mb-1">
                                {t("payment.city")} *
                              </label>
                              <input
                                type="text"
                                id="billingCity"
                                name="billingCity"
                                value={formData.billingCity}
                                onChange={handleChange}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50 py-2"
                                required
                              />
                            </div>

                            <div>
                              <label htmlFor="billingCountry" className="block text-sm font-medium text-gray-700 mb-1">
                                {t("payment.country")} *
                              </label>
                              <input
                                type="text"
                                id="billingCountry"
                                name="billingCountry"
                                value={formData.billingCountry}
                                onChange={handleChange}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50 py-2"
                                required
                              />
                            </div>

                            <div>
                              <label htmlFor="billingZipCode" className="block text-sm font-medium text-gray-700 mb-1">
                                {t("payment.zipCode")} *
                              </label>
                              <input
                                type="text"
                                id="billingZipCode"
                                name="billingZipCode"
                                value={formData.billingZipCode}
                                onChange={handleChange}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50 py-2"
                                required
                              />
                            </div>
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
                                handleClose();
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
                      </>
                    )}
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
