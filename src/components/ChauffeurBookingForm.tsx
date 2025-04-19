import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ClockIcon, MapPinIcon, CalendarIcon, UserIcon, TruckIcon, CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Vehicle } from "../data/vehicles";
import ChauffeurBookingConfirmation from "./ChauffeurBookingConfirmation";

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
    pickupDate: today,
    pickupTime: '10:00',
    pickupLocation: '',
    dropoffLocation: '',
    duration: 4, // Default duration is 4 hours
    passengers: 1,
    specialRequests: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    paymentMethod: 'cash'
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

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Only allow submission if user is on the Review & Confirm step AND confirm button was clicked
    if (currentStep === 3 && confirmClicked) {
      setFormSubmitted(true);
      // Generate a booking ID
      const newBookingId = generateBookingId();
      setBookingId(newBookingId);
      onSubmit(formData);
      // Show the confirmation modal instead of the inline confirmation
      setShowConfirmation(true);
      // Reset the flag after submission
      setConfirmClicked(false);
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
          formData.contactName !== '' &&
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
                placeholder="Enter full pickup address"
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
                placeholder="Enter full drop-off address"
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
              <input
                type="time"
                id="pickupTime"
                name="pickupTime"
                value={formData.pickupTime}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50 pl-10 py-2"
                required
              />
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
            placeholder="Any special requirements or additional information"
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
            <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">
              {t("chauffeur.booking.fullName")} *
            </label>
            <input
              type="text"
              id="contactName"
              name="contactName"
              value={formData.contactName}
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

        <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-600">
          <p>{t('booking.requiredFields')}</p>
        </div>
      </div>
    );
  };

  // Booking summary
  const renderSummaryStep = () => {
    // Calculate estimated price based on duration
    const rate = hourlyRate || vehicle.basePrice;
    const totalPrice = rate * formData.duration;

    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-primary">{t("chauffeur.booking.bookingSummary")}</h3>

        <div className="bg-gray-50 p-5 rounded-lg">
          <div className="flex items-center mb-4">
            <TruckIcon className="h-6 w-6 text-secondary mr-2" />
            <h4 className="font-medium text-lg">{vehicle.name}</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
            <div className="flex items-start">
              <MapPinIcon className="h-5 w-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">{t("chauffeur.booking.pickupLocation")}</p>
                <p className="font-medium">{formData.pickupLocation}</p>
                <p className="text-sm mt-1">{formData.pickupDate} at {formData.pickupTime}</p>
              </div>
            </div>

            <div className="flex items-start">
              <MapPinIcon className="h-5 w-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">{t("chauffeur.booking.dropoffLocation")}</p>
                <p className="font-medium">{formData.dropoffLocation}</p>
              </div>
            </div>

            <div className="flex items-start">
              <ClockIcon className="h-5 w-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">{t("chauffeur.booking.duration")}</p>
                <p className="font-medium">{formData.duration} {t("chauffeur.hours")}</p>
              </div>
            </div>

            <div className="flex items-start">
              <UserIcon className="h-5 w-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">{t("transfer.passengers")}</p>
                <p className="font-medium">{formData.passengers} {formData.passengers > 1 ? t("booking.guests") : t("booking.guest")}</p>
              </div>
            </div>
          </div>

          {formData.specialRequests && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">{t("chauffeur.booking.specialRequests")}</p>
              <p className="text-gray-700 mt-1">{formData.specialRequests}</p>
            </div>
          )}
        </div>

        <div className="border-t border-b py-4">
          <div className="flex justify-between mb-2">
            <span className="font-medium">{t("chauffeur.booking.hourlyRate")}</span>
            <span>€{rate}/{t("chauffeur.hours")}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="font-medium">{t("chauffeur.booking.duration")}</span>
            <span>{formData.duration} {t("chauffeur.hours")}</span>
          </div>
          <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
            <span>{t("chauffeur.booking.estimatedTotal")}</span>
            <span className="text-secondary">€{totalPrice}</span>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="font-medium mb-2">{t("chauffeur.booking.bookingDetails")}</h4>
          <p className="mb-1">{formData.contactName}</p>
          <p className="mb-1">{formData.contactEmail}</p>
          <p>{formData.contactPhone}</p>
        </div>

        {/* Payment Method */}
        <div>
          <h4 className="text-md font-medium text-gray-700 mb-2">{t('transfer.paymentMethod')}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
          </div>
        </div>
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
          customerName: formData.contactName,
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
