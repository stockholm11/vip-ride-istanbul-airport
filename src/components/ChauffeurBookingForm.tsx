import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ClockIcon, MapPinIcon, CalendarIcon, UserIcon, TruckIcon, CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Vehicle } from "../data/vehicles";
import ChauffeurBookingConfirmation from "./ChauffeurBookingConfirmation";
import { API_ENDPOINTS } from '../services/api';

interface ChauffeurBookingFormProps {
  vehicle: Vehicle;
  onSubmit: (formData: ChauffeurBookingData) => void;
  onCancel: () => void;
  hourlyRate?: number;
}

export interface ChauffeurBookingData {
  vehicleId: string;
  pickupDate: string;
  pickupTime: string;
  pickupLocation: string;
  dropoffLocation: string;
  duration: number;
  passengers: number;
  specialRequests: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  paymentMethod: "cash" | "creditCard";
  // Billing information
  firstName: string;
  lastName: string;
  billingAddress: string;
  billingCity: string;
  billingCountry: string;
  billingZipCode: string;
  // Card information
  cardNumber?: string;
  cardHolderName?: string;
  expiryDate?: string;
  cvv?: string;
}

export default function ChauffeurBookingForm({
  vehicle,
  onSubmit,
  onCancel,
  hourlyRate
}: ChauffeurBookingFormProps) {
  const { t } = useTranslation();
  const today = new Date().toISOString().split('T')[0];

  // Initialize form state
  const [formData, setFormData] = useState<ChauffeurBookingData>({
    vehicleId: vehicle.id,
    pickupDate: '',
    pickupTime: '',
    pickupLocation: '',
    dropoffLocation: '',
    duration: 4, // Default duration is 4 hours
    passengers: 1,
    specialRequests: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    paymentMethod: 'cash',
    // Billing information
    firstName: '',
    lastName: '',
    billingAddress: '',
    billingCity: 'Istanbul',
    billingCountry: 'Turkey',
    billingZipCode: '',
    // Card information
    cardNumber: '',
    cardHolderName: '',
    expiryDate: '',
    cvv: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [formSubmitted, setFormSubmitted] = useState(false);
  // Flag to track if confirm button was clicked
  const [confirmClicked, setConfirmClicked] = useState(false);
  // New state for confirmation modal
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingId, setBookingId] = useState("");

  // Generate a random booking ID
  const generateBookingId = () => {
    return `CHF-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`;
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

  // Add validation function for date and time
  const isDateTimeValid = (selectedDate: string, selectedTime: string) => {
    const now = new Date();
    const selectedDateTime = new Date(`${selectedDate}T${selectedTime}`);
    
    // Add 1 hour buffer to prevent bookings too close to current time
    const bufferTime = new Date(now.getTime() + 60 * 60 * 1000);
    
    return selectedDateTime >= bufferTime;
  };

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Special handling for date and time validation
    if (name === 'pickupDate' || name === 'pickupTime') {
      const newDate = name === 'pickupDate' ? value : formData.pickupDate;
      const newTime = name === 'pickupTime' ? value : formData.pickupTime;
      
      if (newDate && newTime) {
        if (!isDateTimeValid(newDate, newTime)) {
          alert(t('booking.invalidDateTime'));
          return;
        }
      }
    }

    // Kart numarası formatlaması
    if (name === 'cardNumber') {
      const formattedValue = value
        .replace(/\D/g, '') // Sadece sayıları al
        .replace(/(\d{4})/g, '$1 ') // Her 4 rakamdan sonra boşluk ekle
        .trim(); // Baştaki ve sondaki boşlukları temizle
      setFormData(prev => ({ ...prev, [name]: formattedValue }));
      return;
    }

    // Son kullanma tarihi formatlaması
    if (name === 'expiryDate') {
      const formattedValue = value
        .replace(/\D/g, '') // Sadece sayıları al
        .replace(/(\d{2})(\d{0,2})/, '$1/$2') // MM/YY formatı
        .substring(0, 5); // Maksimum 5 karakter (MM/YY)
      setFormData(prev => ({ ...prev, [name]: formattedValue }));
      return;
    }

    // CVV için sadece sayı girişi
    if (name === 'cvv') {
      const formattedValue = value.replace(/\D/g, '').substring(0, 4);
      setFormData(prev => ({ ...prev, [name]: formattedValue }));
      return;
    }

    // Diğer alanlar için normal değişiklik
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Only allow submission if user is on the Review & Confirm step AND confirm button was clicked
    if (currentStep === 3 && confirmClicked) {
      try {
        if (formData.paymentMethod === 'creditCard') {
          // Validate credit card fields
          if (!formData.cardNumber || !formData.cardHolderName || !formData.expiryDate || !formData.cvv) {
            throw new Error(t('payment.pleaseFillAllFields'));
          }

          // Validate card number format
          const cardNumber = formData.cardNumber.replace(/\s/g, '');
          if (!/^\d{16}$/.test(cardNumber)) {
            throw new Error(t('payment.invalidCardNumber'));
          }

          // Validate expiry date format
          if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
            throw new Error(t('payment.invalidExpiryDate'));
          }

          // Validate CVV format
          if (!/^\d{3,4}$/.test(formData.cvv)) {
            throw new Error(t('payment.invalidCvv'));
          }

          // Calculate total price
          const totalPrice = formData.duration * (hourlyRate || 0);

          // Prepare payment data for iyzico
          const paymentData = {
            locale: 'tr',
            conversationId: `CHF-${Date.now()}`,
            price: totalPrice.toString(),
            paidPrice: totalPrice.toString(),
            currency: 'EUR',
            installment: '1',
            basketId: `CHF-${Date.now()}`,
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
              id: `CHF-${Date.now()}`,
              name: formData.firstName,
              surname: formData.lastName,
              gsmNumber: formData.contactPhone,
              email: formData.contactEmail,
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
                id: '1',
                name: `${formData.duration} Hour Chauffeur Service`,
                category1: 'Chauffeur',
                itemType: 'PHYSICAL',
                price: totalPrice.toString()
              }
            ],
            // Rezervasyon detaylarını ekle
            bookingDetails: {
              email: formData.contactEmail,
              firstName: formData.firstName,
              lastName: formData.lastName,
              serviceName: `${formData.duration} Hour Chauffeur Service - ${vehicle.name}`,
              date: formData.pickupDate,
              time: formData.pickupTime,
              pickupLocation: formData.pickupLocation,
              dropoffLocation: formData.dropoffLocation,
              totalPrice: totalPrice,
              bookingReference: `CHF-${Date.now()}`
            }
          };

          // Make payment request to backend
          const response = await fetch(API_ENDPOINTS.payment, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(paymentData),
          });

          const result = await response.json();

          if (!response.ok) {
            throw new Error(result.error || t('payment.paymentFailed'));
          }

          if (result.status !== 'success') {
            throw new Error(result.errorMessage || t('payment.paymentFailed'));
          }

          // Log successful payment
          console.log('Payment successful:', result);
        }

        setFormSubmitted(true);
        // Generate a booking ID
        const newBookingId = generateBookingId();
        setBookingId(newBookingId);
        onSubmit(formData);
        // Show the confirmation modal instead of the inline confirmation
        setShowConfirmation(true);
        // Reset the flag after submission
        setConfirmClicked(false);
      } catch (error) {
        console.error('Payment error:', error);
        // Show error message in a more user-friendly way
        alert(error instanceof Error ? error.message : t('payment.paymentError'));
      }
    } else {
      // If not on the confirm step or confirm not clicked, just go to the next step
      nextStep();
    }
  };

  // Navigation between steps
  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Check if current step is complete
  const isStepComplete = () => {
    switch (currentStep) {
      case 1: // Trip details
        return (
          formData.pickupDate !== '' &&
          formData.pickupTime !== '' &&
          formData.pickupLocation !== '' &&
          formData.dropoffLocation !== ''
        );
      case 2: // Contact info
        return (
          formData.firstName !== '' &&
          formData.lastName !== '' &&
          formData.contactEmail !== '' &&
          formData.contactPhone !== ''
        );
      case 3: // Review & Confirm
        // User must manually click confirm on step 3
        return true;
      default:
        return false;
    }
  };

  // Render different form steps
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderTripDetailsStep();
      case 2:
        return renderContactInfoStep();
      case 3:
        return renderSummaryStep();
      default:
        return null;
    }
  };

  // Trip details form
  const renderTripDetailsStep = () => {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-primary">{t("chauffeur.booking.tripDetails")}</h3>

        {/* Pickup/Dropoff Locations */}
        <div className="space-y-4">
          <div>
            <label htmlFor="pickupLocation" className="block text-sm font-medium text-gray-700 mb-1">
              {t("chauffeur.booking.pickupLocation")} *
            </label>
            <div className="relative">
              <input
                type="text"
                id="pickupLocation"
                name="pickupLocation"
                value={formData.pickupLocation}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50 pl-10 py-2"
                placeholder={t("chauffeur.booking.pickupLocation")}
                required
              />
              <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label htmlFor="dropoffLocation" className="block text-sm font-medium text-gray-700 mb-1">
              {t("chauffeur.booking.dropoffLocation")} *
            </label>
            <div className="relative">
              <input
                type="text"
                id="dropoffLocation"
                name="dropoffLocation"
                value={formData.dropoffLocation}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50 pl-10 py-2"
                placeholder={t("chauffeur.booking.dropoffLocation")}
                required
              />
              <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Pickup Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="pickupDate" className="block text-sm font-medium text-gray-700 mb-1">
              {t("chauffeur.booking.pickupDate")} *
            </label>
            <div className="relative">
              <input
                type="date"
                id="pickupDate"
                name="pickupDate"
                min={today}
                value={formData.pickupDate}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50 pl-10 py-2"
                required
              />
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label htmlFor="pickupTime" className="block text-sm font-medium text-gray-700 mb-1">
              {t("chauffeur.booking.pickupTime")} *
            </label>
            <div className="relative">
              <select
                id="pickupTime"
                name="pickupTime"
                value={formData.pickupTime}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50 pl-10 py-2"
                required
              >
                <option value="">{t("booking.selectTime")}</option>
                {Array.from({ length: 24 }).map((_, i) => (
                  <option key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                    {`${i.toString().padStart(2, '0')}:00`}
                  </option>
                ))}
              </select>
              <ClockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Duration and Passengers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
              {t("chauffeur.booking.duration")} *
            </label>
            <div className="relative">
              <select
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50 pl-10 py-2"
                required
              >
                <option value="4">4 {t("chauffeur.hours")} ({t("booking.minimum")})</option>
                <option value="6">6 {t("chauffeur.hours")}</option>
                <option value="8">8 {t("chauffeur.hours")}</option>
                <option value="10">10 {t("chauffeur.hours")}</option>
                <option value="12">12 {t("chauffeur.hours")}</option>
                <option value="24">24 {t("chauffeur.hours")} ({t("chauffeur.dailyService")})</option>
              </select>
              <ClockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label htmlFor="passengers" className="block text-sm font-medium text-gray-700 mb-1">
              {t("chauffeur.booking.passengers")} *
            </label>
            <div className="relative">
              <select
                id="passengers"
                name="passengers"
                value={formData.passengers}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50 pl-10 py-2"
                required
              >
                {[...Array(vehicle.passengerCapacity)].map((_, i) => (
                  <option key={i+1} value={i+1}>{i+1}</option>
                ))}
              </select>
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500 mt-1">{t("booking.maximum")}: {vehicle.passengerCapacity} {t("transfer.passengers")}</p>
          </div>
        </div>

        {/* Special Requests */}
        <div>
          <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-1">
            {t("chauffeur.booking.specialRequests")}
          </label>
          <textarea
            id="specialRequests"
            name="specialRequests"
            rows={3}
            value={formData.specialRequests}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50"
            placeholder={t("booking.addSpecialRequests")}
          ></textarea>
        </div>
      </div>
    );
  };

  // Contact information form
  const renderContactInfoStep = () => {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-primary">{t("chauffeur.booking.contactInfo")}</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              {t("booking.firstName")} *
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50 py-2"
              required
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              {t("booking.lastName")} *
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50 py-2"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
            {t("chauffeur.booking.email")} *
          </label>
          <input
            type="email"
            id="contactEmail"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50 py-2"
            required
          />
        </div>

        <div>
          <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">
            {t("chauffeur.booking.phoneNumber")} *
          </label>
          <input
            type="tel"
            id="contactPhone"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50 py-2"
            placeholder="+90 5XX XXX XXXX"
            required
          />
        </div>

        {/* Billing Address */}
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
      </div>
    );
  };

  // Booking summary
  const renderSummaryStep = () => {
    const totalPrice = formData.duration * (hourlyRate || 0);

    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-primary">{t("chauffeur.booking.reviewConfirm")}</h3>

        {/* Trip Summary */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-3">{t("chauffeur.booking.tripDetails")}</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">{t("chauffeur.booking.pickupLocation")}:</span>
              <span className="font-medium">{formData.pickupLocation}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("chauffeur.booking.dropoffLocation")}:</span>
              <span className="font-medium">{formData.dropoffLocation}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("chauffeur.booking.pickupDate")}:</span>
              <span className="font-medium">{formData.pickupDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("chauffeur.booking.pickupTime")}:</span>
              <span className="font-medium">{formData.pickupTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("chauffeur.booking.duration")}:</span>
              <span className="font-medium">{formData.duration} {t("chauffeur.hours")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("chauffeur.booking.passengers")}:</span>
              <span className="font-medium">{formData.passengers}</span>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-3">{t("chauffeur.booking.contactInfo")}</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">{t("chauffeur.booking.fullName")}:</span>
              <span className="font-medium">{formData.firstName} {formData.lastName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("chauffeur.booking.email")}:</span>
              <span className="font-medium">{formData.contactEmail}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("chauffeur.booking.phoneNumber")}:</span>
              <span className="font-medium">{formData.contactPhone}</span>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-3">{t("booking.paymentMethod")}</h4>
          <div className="space-y-4">
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
                <span className="ml-2 text-sm font-medium">{t("booking.cash")}</span>
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
                <span className="ml-2 text-sm font-medium">{t("booking.creditCard")}</span>
              </label>
            </div>

            {/* Credit Card Form Fields */}
            {formData.paymentMethod === 'creditCard' && (
              <div className="mt-4 space-y-4">
                <div>
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    {t("payment.cardNumber")} *
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber || ''}
                    onChange={handleChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    required={formData.paymentMethod === 'creditCard'}
                  />
                </div>

                <div>
                  <label htmlFor="cardHolderName" className="block text-sm font-medium text-gray-700 mb-1">
                    {t("payment.cardholderName")} *
                  </label>
                  <input
                    type="text"
                    id="cardHolderName"
                    name="cardHolderName"
                    value={formData.cardHolderName || ''}
                    onChange={handleChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50"
                    placeholder="JOHN DOE"
                    required={formData.paymentMethod === 'creditCard'}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                      {t("payment.expiryDate")} *
                    </label>
                    <input
                      type="text"
                      id="expiryDate"
                      name="expiryDate"
                      value={formData.expiryDate || ''}
                      onChange={handleChange}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50"
                      placeholder="MM/YY"
                      maxLength={5}
                      required={formData.paymentMethod === 'creditCard'}
                    />
                  </div>

                  <div>
                    <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                      {t("payment.cvv")} *
                    </label>
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      value={formData.cvv || ''}
                      onChange={handleChange}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50"
                      placeholder="123"
                      maxLength={4}
                      required={formData.paymentMethod === 'creditCard'}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Total Price */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">{t("booking.totalPrice")}:</span>
            <span className="text-2xl font-bold text-secondary">€{totalPrice}</span>
          </div>
        </div>

        {/* Special Requests */}
        {formData.specialRequests && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">{t("chauffeur.booking.specialRequests")}</h4>
            <p className="text-sm text-gray-600">{formData.specialRequests}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
        {/* Only show the form if not submitted AND confirmation is not shown */}
        {!formSubmitted && !showConfirmation ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-primary">
                {t("chauffeur.booking.title")}
              </h2>
              <button
                onClick={onCancel}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Step indicators */}
            <div className="flex mb-8">
              {[t("chauffeur.booking.tripDetails"), t("chauffeur.booking.contactInfo"), t("chauffeur.booking.reviewConfirm")].map((step, index) => (
                <div key={index} className="flex-1 relative">
                  <div className={`
                    flex flex-col items-center
                    ${currentStep > index + 1 ? 'text-green-600' : currentStep === index + 1 ? 'text-primary' : 'text-gray-400'}
                  `}>
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center mb-2
                      ${currentStep > index + 1
                        ? 'bg-green-100 border-2 border-green-600'
                        : currentStep === index + 1
                        ? 'bg-primary text-white'
                        : 'bg-gray-200'
                      }
                    `}>
                      {currentStep > index + 1 ? (
                        <CheckCircleIcon className="h-6 w-6" />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>
                    <div className="text-xs text-center">
                      {step}
                    </div>
                  </div>
                  {index < 2 && (
                    <div className={`absolute top-4 left-1/2 w-full h-0.5
                      ${currentStep > index + 1 ? 'bg-green-600' : 'bg-gray-300'}`}
                    />
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              {/* Step content */}
              {renderStepContent()}

              {/* Navigation buttons */}
              <div className="flex justify-between mt-8 pt-4 border-t">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    {t("chauffeur.booking.back")}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    {t("chauffeur.booking.cancel")}
                  </button>
                )}

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      nextStep();
                    }}
                    disabled={!isStepComplete()}
                    className={`
                      px-6 py-2 rounded-md
                      ${isStepComplete()
                        ? 'bg-secondary text-white hover:bg-secondary-dark'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
                    `}
                  >
                    {t("chauffeur.booking.continue")}
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-6 py-2 bg-secondary text-white font-semibold rounded-md hover:bg-secondary-dark transition-colors"
                    onClick={() => {
                      // Set the flag when confirm button is clicked
                      setConfirmClicked(true);
                    }}
                  >
                    {t("chauffeur.booking.confirmBooking")}
                  </button>
                )}
              </div>
            </form>
          </>
        ) : null}
      </div>

      {/* Render the confirmation modal */}
      <ChauffeurBookingConfirmation
        isOpen={showConfirmation}
        onClose={() => {
          setShowConfirmation(false);
          onCancel(); // Close the form completely
        }}
        bookingDetails={{
          bookingId: bookingId,
          customerName: formData.firstName + ' ' + formData.lastName,
          serviceName: t("chauffeur.title"),
          date: formData.pickupDate,
          time: formData.pickupTime,
          duration: formData.duration,
          passengers: formData.passengers,
          totalPrice: (hourlyRate || vehicle.basePrice) * formData.duration,
          pickupLocation: formData.pickupLocation,
          dropoffLocation: formData.dropoffLocation,
          specialRequests: formData.specialRequests,
          vehicle: vehicle,
          paymentMethod: formData.paymentMethod
        }}
      />
    </>
  );
}
