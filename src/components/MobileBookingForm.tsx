import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
  UsersIcon,
  BriefcaseIcon,
  ArrowRightIcon,
  ChevronRightIcon,
  ChevronLeftIcon
} from "@heroicons/react/24/outline";
import { TransferFormData } from "./TransferBookingForm";
import { TransferType } from "../data/vehicles";

interface MobileBookingFormProps {
  onSearch: (formData: TransferFormData) => void;
  initialTransferType?: TransferType;
}

// List of popular airport transfers
const POPULAR_AIRPORT_TRANSFERS = [
  { label: "fromIstanbul", fromId: "ist", toId: "", transferType: "airport", icon: "airport-to-city" },
  { label: "toIstanbul", fromId: "", toId: "ist", transferType: "airport", icon: "city-to-airport" },
  { label: "fromSabiha", fromId: "saw", toId: "", transferType: "airport", icon: "airport-to-city" },
  { label: "toSabiha", fromId: "", toId: "saw", transferType: "airport", icon: "city-to-airport" },
];

// Most popular destinations
const POPULAR_DESTINATIONS = [
  { id: "taksim", name: "Taksim" },
  { id: "sultanahmet", name: "Sultanahmet" },
  { id: "besiktas", name: "Beşiktaş" },
  { id: "kadikoy", name: "Kadıköy" },
  { id: "uskudar", name: "Üsküdar" },
  { id: "sisli", name: "Şişli" },
  { id: "fatih", name: "Fatih" },
];

const AIRPORTS = [
  { id: "ist", name: "Istanbul Airport (IST)" },
  { id: "saw", name: "Sabiha Gökçen Airport (SAW)" },
];

export default function MobileBookingForm({ onSearch, initialTransferType = "airport" }: MobileBookingFormProps) {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<TransferFormData>({
    transferType: initialTransferType,
    fromLocation: "",
    toLocation: "",
    date: new Date().toISOString().split("T")[0], // Today's date
    time: "10:00", // Default time
    passengers: 1,
    luggage: 1,
    roundTrip: false,
  });

  // Calculate min date (today)
  const today = new Date().toISOString().split("T")[0];

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle popular transfer selection
  const handlePopularTransfer = (transfer: typeof POPULAR_AIRPORT_TRANSFERS[0]) => {
    setFormData((prev) => ({
      ...prev,
      transferType: transfer.transferType as 'airport' | 'intercity' | 'city',
      fromLocation: transfer.fromId,
      toLocation: transfer.toId,
    }));
  };

  // Handle navigation between steps
  const goToNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    onSearch(formData);
  };

  // Check if the current step is complete and we can move to the next step
  const isStepComplete = () => {
    switch (currentStep) {
      case 1:
        return formData.fromLocation && formData.toLocation;
      case 2:
        return formData.date && formData.time && (!formData.roundTrip || (formData.returnDate && formData.returnTime));
      case 3:
        return true;
      default:
        return false;
    }
  };

  // Render appropriate step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderRouteStep();
      case 2:
        return renderDateTimeStep();
      case 3:
        return renderPassengersStep();
      default:
        return null;
    }
  };

  // Step 1: Origin and Destination
  const renderRouteStep = () => {
    return (
      <div className="space-y-6">
        <div className="bg-primary/5 p-4 rounded-lg mb-4">
          <h4 className="text-sm font-medium text-primary mb-3">{t("transfer.quickSelect")}</h4>
          <div className="grid grid-cols-2 gap-3">
            {POPULAR_AIRPORT_TRANSFERS.map((transfer) => (
              <button
                key={transfer.label}
                onClick={() => handlePopularTransfer(transfer)}
                className={`flex items-center justify-center p-3 text-sm rounded-lg border ${
                  (transfer.fromId && formData.fromLocation === transfer.fromId) ||
                  (transfer.toId && formData.toLocation === transfer.toId)
                    ? "border-secondary bg-secondary/10"
                    : "border-gray-200"
                }`}
              >
                {t(`transfer.${transfer.label}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <label htmlFor="mobileFromLocation" className="block text-sm font-medium text-gray-700 mb-1">
              {t("transfer.fromLocation")}
            </label>
            <div className="relative">
              <select
                id="mobileFromLocation"
                name="fromLocation"
                value={formData.fromLocation}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50 pl-10 py-3"
                required
              >
                <option value="">{t("transfer.selectLocation")}</option>
                {formData.transferType === "airport" ? (
                  <>
                    {AIRPORTS.map((airport) => (
                      <option key={airport.id} value={airport.id}>
                        {airport.name}
                      </option>
                    ))}
                    {POPULAR_DESTINATIONS.map((destination) => (
                      <option key={destination.id} value={destination.id}>
                        {destination.name}
                      </option>
                    ))}
                  </>
                ) : (
                  POPULAR_DESTINATIONS.map((destination) => (
                    <option key={destination.id} value={destination.id}>
                      {destination.name}
                    </option>
                  ))
                )}
              </select>
              <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="relative">
            <label htmlFor="mobileToLocation" className="block text-sm font-medium text-gray-700 mb-1">
              {t("transfer.toLocation")}
            </label>
            <div className="relative">
              <select
                id="mobileToLocation"
                name="toLocation"
                value={formData.toLocation}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50 pl-10 py-3"
                required
              >
                <option value="">{t("transfer.selectLocation")}</option>
                {formData.transferType === "airport" ? (
                  <>
                    {AIRPORTS.map((airport) => (
                      <option key={airport.id} value={airport.id}>
                        {airport.name}
                      </option>
                    ))}
                    {POPULAR_DESTINATIONS.map((destination) => (
                      <option key={destination.id} value={destination.id}>
                        {destination.name}
                      </option>
                    ))}
                  </>
                ) : (
                  POPULAR_DESTINATIONS.map((destination) => (
                    <option key={destination.id} value={destination.id}>
                      {destination.name}
                    </option>
                  ))
                )}
              </select>
              <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Step 2: Date and Time
  const renderDateTimeStep = () => {
    return (
      <div className="space-y-5">
        <div className="relative">
          <label htmlFor="mobileDate" className="block text-sm font-medium text-gray-700 mb-1">
            {t("transfer.date")}
          </label>
          <div className="relative">
            <input
              type="date"
              id="mobileDate"
              name="date"
              min={today}
              value={formData.date}
              onChange={handleChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50 pl-10 py-3"
              required
            />
            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="relative">
          <label htmlFor="mobileTime" className="block text-sm font-medium text-gray-700 mb-1">
            {t("transfer.time")}
          </label>
          <div className="relative">
            <select
              id="mobileTime"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50 pl-10 py-3"
              required
            >
              <option value="">{t("booking.selectTime")}</option>
              {Array.from({ length: 24 }).map((_, i) => (
                <option key={i} value={`${i.toString().padStart(2, "0")}:00`}>
                  {`${i.toString().padStart(2, "0")}:00`}
                </option>
              ))}
            </select>
            <ClockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="flex items-center mt-3">
          <input
            type="checkbox"
            id="mobileRoundTrip"
            name="roundTrip"
            checked={formData.roundTrip}
            onChange={handleChange}
            className="h-5 w-5 text-secondary focus:ring-secondary border-gray-300 rounded"
          />
          <label htmlFor="mobileRoundTrip" className="ml-2 block text-sm text-gray-700">
            {t("transfer.roundTrip")}
          </label>
        </div>

        {formData.roundTrip && (
          <div className="space-y-4 mt-4 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700">{t("transfer.returnTrip")}</h4>

            <div className="relative">
              <label htmlFor="mobileReturnDate" className="block text-sm font-medium text-gray-700 mb-1">
                {t("transfer.returnDate")}
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="mobileReturnDate"
                  name="returnDate"
                  min={formData.date || today}
                  value={formData.returnDate || ""}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50 pl-10 py-3"
                  required={formData.roundTrip}
                />
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="relative">
              <label htmlFor="mobileReturnTime" className="block text-sm font-medium text-gray-700 mb-1">
                {t("transfer.returnTime")}
              </label>
              <div className="relative">
                <select
                  id="mobileReturnTime"
                  name="returnTime"
                  value={formData.returnTime || ""}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50 pl-10 py-3"
                  required={formData.roundTrip}
                >
                  <option value="">{t("booking.selectTime")}</option>
                  {Array.from({ length: 24 }).map((_, i) => (
                    <option key={i} value={`${i.toString().padStart(2, "0")}:00`}>
                      {`${i.toString().padStart(2, "0")}:00`}
                    </option>
                  ))}
                </select>
                <ClockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Step 3: Passengers and Luggage
  const renderPassengersStep = () => {
    return (
      <div className="space-y-5">
        <div className="relative">
          <label htmlFor="mobilePassengers" className="block text-sm font-medium text-gray-700 mb-1">
            {t("transfer.passengers")}
          </label>
          <div className="relative">
            <select
              id="mobilePassengers"
              name="passengers"
              value={formData.passengers}
              onChange={handleChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50 pl-10 py-3"
              required
            >
              {Array.from({ length: 16 }).map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            <UsersIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="relative">
          <label htmlFor="mobileLuggage" className="block text-sm font-medium text-gray-700 mb-1">
            {t("transfer.luggage")}
          </label>
          <div className="relative">
            <select
              id="mobileLuggage"
              name="luggage"
              value={formData.luggage}
              onChange={handleChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50 pl-10 py-3"
              required
            >
              {Array.from({ length: 10 }).map((_, i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
            <BriefcaseIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="bg-primary/5 p-4 rounded-lg mt-4">
          <h4 className="text-sm font-medium text-primary mb-2">{t("transfer.bookingSummary")}</h4>

          <div className="flex items-center text-sm text-gray-600 mb-2">
            <MapPinIcon className="h-4 w-4 mr-2 text-secondary" />
            <span className="text-gray-800">{formData.fromLocation}</span>
            <ArrowRightIcon className="h-3 w-3 mx-2" />
            <span className="text-gray-800">{formData.toLocation}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <CalendarIcon className="h-4 w-4 mr-2 text-secondary" />
            <span>{formData.date} - {formData.time}</span>
          </div>

          {formData.roundTrip && formData.returnDate && formData.returnTime && (
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <CalendarIcon className="h-4 w-4 mr-2 text-secondary" />
              <span>{t("transfer.returnTrip")}: {formData.returnDate} - {formData.returnTime}</span>
            </div>
          )}

          <div className="flex items-center text-sm text-gray-600 mt-1">
            <UsersIcon className="h-4 w-4 mr-2 text-secondary" />
            <span>{formData.passengers} {t("transfer.passengers")}, {formData.luggage} {t("transfer.luggage")}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-5">
      <h3 className="text-lg font-bold text-primary mb-4">{t("transfer.simplifiedBooking")}</h3>

      {/* Step indicators */}
      <div className="flex mb-6 bg-gray-100 rounded-full overflow-hidden">
        {[1, 2, 3].map((step) => (
          <div
            key={step}
            className={`flex-1 py-2 text-center text-xs font-medium ${
              currentStep === step
                ? "bg-primary text-white"
                : currentStep > step
                ? "bg-primary/20 text-primary"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {t(`transfer.step${step}`)}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="mb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={goToPrevStep}
          className={`flex items-center justify-center px-4 py-2 rounded-md ${
            currentStep > 1
              ? "text-gray-700 bg-gray-100 hover:bg-gray-200"
              : "text-gray-400 bg-gray-50 cursor-not-allowed"
          }`}
          disabled={currentStep === 1}
        >
          <ChevronLeftIcon className="h-4 w-4 mr-1" />
          {t("transfer.back")}
        </button>

        <button
          type="button"
          onClick={goToNextStep}
          disabled={!isStepComplete()}
          className={`btn btn-sm flex items-center justify-center ${
            isStepComplete()
              ? "btn-secondary"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {currentStep === 3 ? t("transfer.continueToVehicles") : t("transfer.next")}
          <ChevronRightIcon className="h-4 w-4 ml-1" />
        </button>
      </div>
    </div>
  );
}
