import { useState, useEffect, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, Transition } from '@headlessui/react';
import {
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
  UsersIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';
import { TransferType } from '../data/vehicles';
import { useIsMobile } from '../hooks/useMediaQuery';

interface TransferBookingFormProps {
  onSearch: (formData: TransferFormData) => void;
  initialTransferType?: TransferType;
}

export interface TransferFormData {
  transferType: TransferType;
  fromLocation: string;
  toLocation: string;
  date: string;
  time: string;
  passengers: number;
  luggage: number;
  roundTrip: boolean;
  returnDate?: string;
  returnTime?: string;
  direction?: 'fromAirport' | 'toDestination'; // Added direction property
}

interface LocationOption {
  id: string;
  name: string;
}

const AIRPORTS: LocationOption[] = [
  { id: 'ist', name: 'Istanbul Airport (IST)' },
  { id: 'saw', name: 'Sabiha Gökçen Airport (SAW)' },
];

const POPULAR_DESTINATIONS: LocationOption[] = [
  { id: 'adalar', name: 'Adalar' },
  { id: 'arnavutkoy', name: 'Arnavutköy' },
  { id: 'atasehir', name: 'Ataşehir' },
  { id: 'avcilar', name: 'Avcılar' },
  { id: 'bagcilar', name: 'Bağcılar' },
  { id: 'bahcelievler', name: 'Bahçelievler' },
  { id: 'bakirkoy', name: 'Bakırköy' },
  { id: 'basaksehir', name: 'Başakşehir' },
  { id: 'bayrampasa', name: 'Bayrampaşa' },
  { id: 'besiktas', name: 'Beşiktaş' },
  { id: 'beykoz', name: 'Beykoz' },
  { id: 'beylikduzu', name: 'Beylikdüzü' },
  { id: 'beyoglu', name: 'Beyoğlu' },
  { id: 'buyukcekmece', name: 'Büyükçekmece' },
  { id: 'catalca', name: 'Çatalca' },
  { id: 'cekmekoy', name: 'Çekmeköy' },
  { id: 'esenler', name: 'Esenler' },
  { id: 'esenyurt', name: 'Esenyurt' },
  { id: 'eyupsultan', name: 'Eyüpsultan' },
  { id: 'fatih', name: 'Fatih' },
  { id: 'gaziosmanpasa', name: 'Gaziosmanpaşa' },
  { id: 'gungoren', name: 'Güngören' },
  { id: 'kadikoy', name: 'Kadıköy' },
  { id: 'kagithane', name: 'Kağıthane' },
  { id: 'kartal', name: 'Kartal' },
  { id: 'kucukcekmece', name: 'Küçükçekmece' },
  { id: 'maltepe', name: 'Maltepe' },
  { id: 'pendik', name: 'Pendik' },
  { id: 'sancaktepe', name: 'Sancaktepe' },
  { id: 'saryer', name: 'Sarıyer' },
  { id: 'silivri', name: 'Silivri' },
  { id: 'sultanbeyli', name: 'Sultanbeyli' },
  { id: 'sultangazi', name: 'Sultangazi' },
  { id: 'sile', name: 'Şile' },
  { id: 'sisli', name: 'Şişli' },
  { id: 'taksim', name: 'Taksim' },
  { id: 'tuzla', name: 'Tuzla' },
  { id: 'umraniye', name: 'Ümraniye' },
  { id: 'uskudar', name: 'Üsküdar' },
  { id: 'zeytinburnu', name: 'Zeytinburnu' },
];

const CITIES: LocationOption[] = [
  { id: 'istanbul', name: 'Istanbul' },
  { id: 'ankara', name: 'Ankara' },
  { id: 'izmir', name: 'Izmir' },
  { id: 'bursa', name: 'Bursa' },
  { id: 'antalya', name: 'Antalya' },
];

export default function TransferBookingForm({ onSearch, initialTransferType = 'airport' }: TransferBookingFormProps) {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [formData, setFormData] = useState<TransferFormData>({
    transferType: initialTransferType,
    fromLocation: '',
    toLocation: '',
    date: '',
    time: '',
    passengers: 1,
    luggage: 1,
    roundTrip: false,
    returnDate: '',
    returnTime: '',
    direction: 'fromAirport',
  });

  // Calculate min date (today)
  const today = new Date().toISOString().split('T')[0];

  // Add validation function for date and time
  const isDateTimeValid = (selectedDate: string, selectedTime: string) => {
    const now = new Date();
    const selectedDateTime = new Date(`${selectedDate}T${selectedTime}`);
    
    // Add 1 hour buffer to prevent bookings too close to current time
    const bufferTime = new Date(now.getTime() + 60 * 60 * 1000);
    
    return selectedDateTime >= bufferTime;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLButtonElement>) => {
    const { name, value, type } = e.target;

    // Special handling for date and time validation
    if (name === 'date' || name === 'time' || name === 'returnDate' || name === 'returnTime') {
      const newDate = name === 'date' ? value : formData.date;
      const newTime = name === 'time' ? value : formData.time;
      
      if (newDate && newTime) {
        if (!isDateTimeValid(newDate, newTime)) {
          alert(t('booking.invalidDateTime'));
          return;
        }
      }

      // For return trip validation
      if (name === 'returnDate' || name === 'returnTime') {
        const newReturnDate = name === 'returnDate' ? value : formData.returnDate;
        const newReturnTime = name === 'returnTime' ? value : formData.returnTime;
        
        if (newReturnDate && newReturnTime) {
          if (!isDateTimeValid(newReturnDate, newReturnTime)) {
            alert(t('booking.invalidDateTime'));
            return;
          }
        }
      }
    }

    if (type === 'checkbox') {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(formData);
  };

  // Logic to determine from/to location options based on transfer type
  const getFromOptions = () => {
    switch (formData.transferType) {
      case 'airport':
        return formData.direction === 'fromAirport' ? AIRPORTS : POPULAR_DESTINATIONS;
      case 'intercity':
        return CITIES;
      case 'city':
        return POPULAR_DESTINATIONS;
      default:
        return [];
    }
  };

  const getToOptions = () => {
    let options: LocationOption[] = [];
    switch (formData.transferType) {
      case 'airport':
        options = POPULAR_DESTINATIONS;
        break;
      case 'intercity':
        options = CITIES;
        break;
      case 'city':
        options = POPULAR_DESTINATIONS;
        break;
      default:
        options = [];
    }
    // Filter out the currently selected fromLocation
    return options.filter(option => option.id !== formData.fromLocation);
  };

  // Form verilerini sıfırlama fonksiyonu
  const resetForm = () => {
    setFormData({
      transferType: initialTransferType,
      fromLocation: '',
      toLocation: '',
      date: '',
      time: '',
      passengers: 1,
      luggage: 1,
      roundTrip: false,
      returnDate: '',
      returnTime: '',
      direction: 'fromAirport',
    });
  };

  // Form kapatıldığında verileri sıfırla
  useEffect(() => {
    return () => {
      resetForm();
    };
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
      <h3 className="text-lg font-bold text-primary mb-4">{t("transfer.bookTransfer")}</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Transfer Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            key="airport"
            type="button"
            onClick={() => handleChange({ target: { name: 'transferType', value: 'airport' } } as React.ChangeEvent<HTMLButtonElement>)}
            className={`flex items-center justify-center p-3 rounded-lg border ${
              formData.transferType === 'airport'
                ? "border-secondary bg-secondary/10 text-secondary"
                : "border-gray-200 hover:border-secondary/50"
            }`}
          >
            {t('nav.airportTransfer')}
          </button>

          <button
            key="intercity"
            type="button"
            onClick={() => handleChange({ target: { name: 'transferType', value: 'intercity' } } as React.ChangeEvent<HTMLButtonElement>)}
            className={`flex items-center justify-center p-3 rounded-lg border ${
              formData.transferType === 'intercity'
                ? "border-secondary bg-secondary/10 text-secondary"
                : "border-gray-200 hover:border-secondary/50"
            }`}
          >
            {t('transfer.intercity')}
          </button>

          <button
            key="city"
            type="button"
            onClick={() => handleChange({ target: { name: 'transferType', value: 'city' } } as React.ChangeEvent<HTMLButtonElement>)}
            className={`flex items-center justify-center p-3 rounded-lg border ${
              formData.transferType === 'city'
                ? "border-secondary bg-secondary/10 text-secondary"
                : "border-gray-200 hover:border-secondary/50"
            }`}
          >
            {t('transfer.cityTransfer')}
          </button>
        </div>

        {/* Location Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <label htmlFor="fromLocation" className="block text-sm font-medium text-gray-700 mb-1">
              {t('transfer.fromLocation')}
            </label>
            <div className="relative">
              <select
                id="fromLocation"
                name="fromLocation"
                value={formData.fromLocation}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50 pl-10 py-2 md:py-3"
                required
              >
                <option value="">{t('transfer.selectLocation')}</option>
                {getFromOptions().map(option => (
                  <option key={option.id} value={option.id}>{option.name}</option>
                ))}
              </select>
              <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="relative">
            <label htmlFor="toLocation" className="block text-sm font-medium text-gray-700 mb-1">
              {t('transfer.toLocation')}
            </label>
            <div className="relative">
              <select
                id="toLocation"
                name="toLocation"
                value={formData.toLocation}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50 pl-10 py-2 md:py-3"
                required
              >
                <option value="">{t('transfer.selectLocation')}</option>
                {getToOptions().map(option => (
                  <option key={option.id} value={option.id}>{option.name}</option>
                ))}
              </select>
              <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Date and Time Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              {t('transfer.date')}
            </label>
            <div className="relative">
              <input
                type="date"
                id="date"
                name="date"
                min={today}
                value={formData.date}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50 pl-10 py-2 md:py-3"
                required
              />
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="relative">
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
              {t('transfer.time')}
            </label>
            <div className="relative">
              <select
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50 pl-10 py-2 md:py-3"
                required
              >
                <option value="">{t('booking.selectTime')}</option>
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

        {/* Passengers and Luggage */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <label htmlFor="passengers" className="block text-sm font-medium text-gray-700 mb-1">
              {t('transfer.passengers')}
            </label>
            <div className="relative">
              <select
                id="passengers"
                name="passengers"
                value={formData.passengers}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50 pl-10 py-2 md:py-3"
                required
              >
                {Array.from({ length: 16 }).map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
              <UsersIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="relative">
            <label htmlFor="luggage" className="block text-sm font-medium text-gray-700 mb-1">
              {t('transfer.luggage')}
            </label>
            <div className="relative">
              <select
                id="luggage"
                name="luggage"
                value={formData.luggage}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50 pl-10 py-2 md:py-3"
                required
              >
                {Array.from({ length: 10 }).map((_, i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
              <BriefcaseIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Round Trip Option */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="roundTrip"
            name="roundTrip"
            checked={formData.roundTrip}
            onChange={handleChange}
            className="h-5 w-5 text-secondary focus:ring-secondary border-gray-300 rounded"
          />
          <label htmlFor="roundTrip" className="ml-2 block text-sm text-gray-700">
            {t('transfer.roundTrip')}
          </label>
        </div>

        {/* Return Date and Time (if round trip) */}
        {formData.roundTrip && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700 mb-1">
                {t('transfer.returnDate')}
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="returnDate"
                  name="returnDate"
                  min={formData.date || today}
                  value={formData.returnDate || ''}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50 pl-10 py-2 md:py-3"
                  required={formData.roundTrip}
                />
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="relative">
              <label htmlFor="returnTime" className="block text-sm font-medium text-gray-700 mb-1">
                {t('transfer.returnTime')}
              </label>
              <div className="relative">
                <select
                  id="returnTime"
                  name="returnTime"
                  value={formData.returnTime || ''}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50 pl-10 py-2 md:py-3"
                  required={formData.roundTrip}
                >
                  <option value="">{t('booking.selectTime')}</option>
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
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-secondary text-white font-semibold rounded-md hover:bg-secondary-dark transition-colors"
        >
          {t('transfer.searchVehicles')}
        </button>
      </form>
    </div>
  );
}
