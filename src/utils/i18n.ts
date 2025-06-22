import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import translationEN from '../locales/en/translation.json';
import translationTR from '../locales/tr/translation.json';
import translationAR from '../locales/ar/translation.json';

// Support for RTL languages
const RTL_LANGUAGES = ['ar'];

// Get stored language preference or fallback to browser language
const getInitialLanguage = (): string => {
  try {
    // Check if localStorage is available (SSR safe check)
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedLanguage = localStorage.getItem('language');
      if (storedLanguage && ['en', 'tr', 'ar'].includes(storedLanguage)) {
        return storedLanguage;
      }
    }

    // Browser language detection with fallback
    if (typeof navigator !== 'undefined') {
      const browserLang = navigator.language.split('-')[0].toLowerCase();
      // Only return if it's one of our supported languages
      if (['en', 'tr', 'ar'].includes(browserLang)) {
        return browserLang;
      }
    }
  } catch (error) {
    console.error('Error getting initial language:', error);
  }

  // Default to English
  return 'en';
};

const resources = {
  en: {
    translation: translationEN
  },
  tr: {
    translation: translationTR
  },
  ar: {
    translation: translationAR
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already prevents XSS
    },
    react: {
      useSuspense: true
    }
  });

// Helper to set document direction based on language
export const setLanguageDirection = (language: string) => {
  const isRTL = RTL_LANGUAGES.includes(language);
  if (typeof document !== 'undefined') {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;

    // Apply RTL-specific CSS classes for Tailwind
    if (isRTL) {
      document.documentElement.classList.add('rtl');
    } else {
      document.documentElement.classList.remove('rtl');
    }
  }
};

// Store language preference in localStorage
export const storeLanguagePreference = (language: string) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('language', language);
    }
  } catch (error) {
    console.error('Error storing language preference:', error);
  }
};

// Check if a language is RTL
export const isRTL = (language: string) => RTL_LANGUAGES.includes(language);

// Apply initial direction
setLanguageDirection(i18n.language);

// Listen for language changes
i18n.on('languageChanged', (lng) => {
  setLanguageDirection(lng);
  storeLanguagePreference(lng);
});

export default i18n;
