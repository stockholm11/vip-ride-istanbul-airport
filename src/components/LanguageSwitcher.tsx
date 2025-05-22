import { useTranslation } from "react-i18next";
import { Menu, Transition } from "@headlessui/react";
import { GlobeAltIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";
import { isRTL } from "../utils/i18n";

// Language options with codes
const languageOptions = [
  { code: "en", name: "English" },
  { code: "tr", name: "Türkçe" },
  { code: "ar", name: "العربية" }
];

interface LanguageSwitcherProps {
  variant?: "minimal" | "full";
  isMobile?: boolean;
  onLanguageChange?: () => void;
  className?: string;
}

// Use a noop function to avoid the empty arrow function warning
const noop = (): void => { /* intentionally empty */ };

export default function LanguageSwitcher({
  variant = "full",
  isMobile = false,
  onLanguageChange = noop,
  className = ""
}: LanguageSwitcherProps) {
  const { i18n } = useTranslation();
  const rtl = isRTL(i18n.language);

  const changeLanguage = (lng: string) => {
    // Get current path
    const currentPath = window.location.pathname;
    
    // Remove any existing language prefix
    const pathWithoutLang = currentPath.replace(/^\/(en|tr|ar)/, '');
    
    // If we're at the root, just add the language
    const newPath = pathWithoutLang === '/' ? `/${lng}` : `/${lng}${pathWithoutLang}`;
    
    // Change the language
    i18n.changeLanguage(lng);
    
    // Navigate to the new URL
    window.location.href = newPath;
    
    onLanguageChange(); // Call the callback (to close menu in mobile view)
  };

  // Find current language details
  const currentLanguage = languageOptions.find(lang => lang.code === i18n.language) || languageOptions[0];

  // For mobile, we'll use a simplified version
  if (isMobile) {
    return (
      <div className={`py-2 border-b border-gray-700 ${className}`}>
        <div className="flex flex-col space-y-2">
          <div className="text-gray-400 font-medium mb-1 flex items-center">
            <GlobeAltIcon className={`w-5 h-5 ${rtl ? 'ml-2' : 'mr-2'}`} />
            {currentLanguage.name}
          </div>
          <div className="grid grid-cols-3 gap-2 pl-4">
            {languageOptions.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`flex items-center px-3 py-2 rounded-md text-sm ${
                  i18n.language === lang.code
                    ? "bg-secondary text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Desktop dropdown - minimal shows just flag and code
  return (
    <Menu as="div" className={`relative ${className}`}>
      <Menu.Button className="flex items-center text-white hover:text-secondary transition-colors">
        {variant === "full" ? (
          <span>{currentLanguage.name}</span>
        ) : (
          <span>{currentLanguage.code.toUpperCase()}</span>
        )}
        <ChevronDownIcon className={`w-4 h-4 ${rtl ? 'mr-1' : 'ml-1'}`} />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <Menu.Items className={`absolute ${rtl ? 'left-0' : 'right-0'} mt-2 w-40 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50`}>
          <div className="px-1 py-1">
            {languageOptions.map((lang) => (
              <Menu.Item key={lang.code}>
                {({ active }) => (
                  <button
                    onClick={() => changeLanguage(lang.code)}
                    className={`${
                      active ? 'bg-gray-100' : ''
                    } ${
                      i18n.language === lang.code ? 'bg-gray-50 text-secondary' : 'text-gray-700'
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm ${rtl ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}
                  >
                    {lang.name}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
