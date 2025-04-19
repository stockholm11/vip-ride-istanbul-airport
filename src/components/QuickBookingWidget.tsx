import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { CalendarIcon, ClockIcon, UserPlusIcon, BriefcaseIcon } from '@heroicons/react/24/outline';
import { useIsMobile } from '../hooks/useMediaQuery';

interface QuickBookingWidgetProps {
  fromLocationId: string;
  toLocationId: string;
  transferType: 'airport' | 'city' | 'intercity';
  initialPassengers?: number;
  initialLuggage?: number;
  onClose?: () => void;
  onSubmit?: (
    fromLocationId: string,
    toLocationId: string,
    transferType: 'airport' | 'city' | 'intercity',
    date: string,
    time: string,
    passengers: number,
    luggage: number,
    roundTrip: boolean,
    returnDate?: string,
    returnTime?: string
  ) => void;
}

const QuickBookingWidget: React.FC<QuickBookingWidgetProps> = ({
  fromLocationId,
  toLocationId,
  transferType,
  initialPassengers = 1,
  initialLuggage = 1,
  onClose,
  onSubmit
}) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    date: today,
    time: '10:00',
    passengers: initialPassengers,
    luggage: initialLuggage,
    roundTrip: false,
    returnDate: '',
    returnTime: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // If onSubmit callback is provided, call it with form data
    if (onSubmit) {
      onSubmit(
        fromLocationId,
        toLocationId,
        transferType,
        formData.date,
        formData.time,
        formData.passengers,
        formData.luggage,
        formData.roundTrip,
        formData.roundTrip ? formData.returnDate : undefined,
        formData.roundTrip ? formData.returnTime : undefined
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-lg shadow-xl ${isMobile ? 'p-5 h-full max-h-[calc(100vh-40px)] overflow-y-auto' : 'p-4'} border border-gray-200`}
    >
      <div className="flex justify-between items-center mb-4">
        <h4 className={`${isMobile ? 'text-xl' : 'text-lg'} font-bold text-primary`}>{t('booking.quickBook')}</h4>
        {!isMobile && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className={`space-y-${isMobile ? '6' : '4'}`}>
        {/* Date and Time */}
        <div className={`grid grid-cols-2 gap-${isMobile ? '4' : '3'}`}>
          <div>
            <label htmlFor="quick-date" className="block text-sm font-medium text-gray-700 mb-1">
              {t('transfer.date')}
            </label>
            <div className="relative">
              <input
                type="date"
                id="quick-date"
                name="date"
                min={today}
                value={formData.date}
                onChange={handleChange}
                className={`w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50 pl-8 ${isMobile ? 'py-3 text-base' : ''}`}
                required
              />
              <CalendarIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div>
            <label htmlFor="quick-time" className="block text-sm font-medium text-gray-700 mb-1">
              {t('transfer.time')}
            </label>
            <div className="relative">
              <select
                id="quick-time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className={`w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50 pl-8 ${isMobile ? 'py-3 text-base' : ''}`}
                required
              >
                {Array.from({ length: 24 }).map((_, i) => (
                  <option key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                    {`${i.toString().padStart(2, '0')}:00`}
                  </option>
                ))}
              </select>
              <ClockIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Passengers and Luggage */}
        <div className={`grid grid-cols-2 gap-${isMobile ? '4' : '3'}`}>
          <div>
            <label htmlFor="quick-passengers" className="block text-sm font-medium text-gray-700 mb-1">
              {t('transfer.passengers')}
            </label>
            <div className="relative">
              <select
                id="quick-passengers"
                name="passengers"
                value={formData.passengers}
                onChange={handleChange}
                className={`w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50 pl-8 ${isMobile ? 'py-3 text-base' : ''}`}
                required
              >
                {Array.from({ length: 16 }).map((_, i) => (
                  <option key={i+1} value={i+1}>{i+1}</option>
                ))}
              </select>
              <UserPlusIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div>
            <label htmlFor="quick-luggage" className="block text-sm font-medium text-gray-700 mb-1">
              {t('transfer.luggage')}
            </label>
            <div className="relative">
              <select
                id="quick-luggage"
                name="luggage"
                value={formData.luggage}
                onChange={handleChange}
                className={`w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50 pl-8 ${isMobile ? 'py-3 text-base' : ''}`}
                required
              >
                {Array.from({ length: 10 }).map((_, i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
              <BriefcaseIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Round Trip Option */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="quick-roundTrip"
            name="roundTrip"
            checked={formData.roundTrip}
            onChange={handleChange}
            className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'} text-secondary focus:ring-secondary border-gray-300 rounded`}
          />
          <label htmlFor="quick-roundTrip" className={`ml-2 block ${isMobile ? 'text-base' : 'text-sm'} text-gray-700`}>
            {t('transfer.roundTrip')}
          </label>
        </div>

        {/* Return Date and Time (if round trip) */}
        {formData.roundTrip && (
          <div className={`grid grid-cols-2 gap-${isMobile ? '4' : '3'}`}>
            <div>
              <label htmlFor="quick-returnDate" className="block text-sm font-medium text-gray-700 mb-1">
                {t('transfer.returnDate')}
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="quick-returnDate"
                  name="returnDate"
                  min={formData.date || today}
                  value={formData.returnDate}
                  onChange={handleChange}
                  className={`w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50 pl-8 ${isMobile ? 'py-3 text-base' : ''}`}
                  required={formData.roundTrip}
                />
                <CalendarIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div>
              <label htmlFor="quick-returnTime" className="block text-sm font-medium text-gray-700 mb-1">
                {t('transfer.returnTime')}
              </label>
              <div className="relative">
                <select
                  id="quick-returnTime"
                  name="returnTime"
                  value={formData.returnTime}
                  onChange={handleChange}
                  className={`w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50 pl-8 ${isMobile ? 'py-3 text-base' : ''}`}
                  required={formData.roundTrip}
                >
                  <option value="">{t('booking.selectTime')}</option>
                  {Array.from({ length: 24 }).map((_, i) => (
                    <option key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                      {`${i.toString().padStart(2, '0')}:00`}
                    </option>
                  ))}
                </select>
                <ClockIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3 bg-secondary text-white font-semibold rounded-md hover:bg-secondary-dark transition-colors"
        >
          {t('booking.bookNow')}
        </button>
      </form>
    </motion.div>
  );
};

export default QuickBookingWidget;
