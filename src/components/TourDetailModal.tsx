import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, ClockIcon, UserGroupIcon, CheckCircleIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';
import { TourType } from './TourCard';

interface TourDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  tour: TourType | null;
  onBookNow: (tour: TourType) => void;
}

export default function TourDetailModal({ isOpen, onClose, tour, onBookNow }: TourDetailModalProps) {
  const { t, i18n } = useTranslation();

  if (!tour) return null;

  // Format price based on current language
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(i18n.language === 'tr' ? 'tr-TR' : i18n.language === 'ar' ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all">
                <div className="relative">
                  {/* Tour Image */}
                  <div className="h-80 w-full">
                    <img
                      src={tour.image}
                      alt={tour.title}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-full bg-white/80 p-2 text-gray-800 hover:bg-white"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>

                  {/* Price Tag */}
                  <div className="absolute top-4 left-4 bg-primary/90 text-white px-4 py-2 rounded-md shadow-lg">
                    <span className="font-bold">{formatPrice(tour.price)}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-primary">{tour.title}</h3>
                    {tour.rating && (
                      <div className="flex items-center">
                        {[...Array(5)].map((_, index) => (
                          <StarIcon
                            key={index}
                            className={`h-5 w-5 ${index < (tour.rating || 0) ? 'text-secondary' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mb-6 flex flex-wrap gap-4">
                    <div className="flex items-center rounded-full bg-gray-100 px-4 py-2">
                      <ClockIcon className="mr-2 h-5 w-5 text-secondary" />
                      <span>{tour.duration} {t('vipTours.hours')}</span>
                    </div>
                    {tour.capacity && (
                      <div className="flex items-center rounded-full bg-gray-100 px-4 py-2">
                        <UserGroupIcon className="mr-2 h-5 w-5 text-secondary" />
                        <span>{tour.capacity} {t('vipTours.persons')}</span>
                      </div>
                    )}
                    {tour.location && (
                      <div className="flex items-center rounded-full bg-gray-100 px-4 py-2">
                        <MapPinIcon className="mr-2 h-5 w-5 text-secondary" />
                        <span>{tour.location}</span>
                      </div>
                    )}
                    {tour.type && (
                      <div className="flex items-center rounded-full bg-gray-100 px-4 py-2">
                        <span className="capitalize">{tour.type.replace(/-/g, ' ')}</span>
                      </div>
                    )}
                  </div>

                  <div className="mb-6">
                    <h4 className="mb-3 text-lg font-semibold text-primary">{t('vipTours.description')}</h4>
                    <p className="text-gray-700">{tour.description}</p>
                  </div>

                  {tour.includes && tour.includes.length > 0 && (
                    <div className="mb-6">
                      <h4 className="mb-3 text-lg font-semibold text-primary">{t('vipTours.includes')}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2">
                        {tour.includes.map((item, index) => (
                          <div key={index} className="flex items-center">
                            <CheckCircleIcon className="mr-2 h-5 w-5 text-secondary" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-8 flex justify-end">
                    <button
                      onClick={() => onBookNow(tour)}
                      className="btn-gold px-8 py-3 font-medium"
                    >
                      {t('vipTours.bookNow')}
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
