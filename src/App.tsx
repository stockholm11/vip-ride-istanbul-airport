import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { I18nextProvider, useTranslation } from "react-i18next";
import i18n from "./utils/i18n";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import VipToursPage from "./pages/VipToursPage";
import TransferPage from "./pages/TransferPage";
import PaymentPage from "./pages/PaymentPage";
import ChauffeurPage from "./pages/ChauffeurPage";
import ContactPage from "./pages/ContactPage";
import NotFoundPage from "./pages/NotFoundPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import CancellationPolicy from "./pages/CancellationPolicy";

function App() {
  const { i18n: i18nInstance } = useTranslation();

  useEffect(() => {
    // Set initial language direction on mount
    document.documentElement.dir = i18nInstance.language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = i18nInstance.language;
  }, [i18nInstance.language]);

  return (
    <I18nextProvider i18n={i18n}>
      <Router>
        <Routes>
          {/* Redirect root to default language */}
          <Route path="/" element={<Navigate to={`/${i18nInstance.language}`} replace />} />

          {/* Language-specific routes */}
          {['en', 'tr', 'ar'].map((lang) => (
            <Route key={lang} path={`/${lang}`}>
          <Route
                index
            element={
              <MainLayout>
                <HomePage />
              </MainLayout>
            }
          />
          <Route
                path="vip-tours"
            element={
              <MainLayout>
                <VipToursPage />
              </MainLayout>
            }
          />
          <Route
                path="transfer"
            element={
              <MainLayout>
                <TransferPage />
              </MainLayout>
            }
          />
          <Route
                path="chauffeur"
            element={
              <MainLayout>
                <ChauffeurPage />
              </MainLayout>
            }
          />
          <Route
                path="contact"
            element={
              <MainLayout>
                <ContactPage />
              </MainLayout>
            }
          />

          {/* VIP Tours Submenu Routes */}
          <Route
                path="vip-tours/cultural-historical"
            element={
              <MainLayout>
                <VipToursPage categoryFilter="cultural-historical" />
              </MainLayout>
            }
          />
          <Route
                path="vip-tours/shopping-entertainment"
            element={
              <MainLayout>
                <VipToursPage categoryFilter="shopping-entertainment" />
              </MainLayout>
            }
          />
          <Route
                path="vip-tours/nature-excursion"
            element={
              <MainLayout>
                <VipToursPage categoryFilter="nature-excursion" />
              </MainLayout>
            }
          />
          <Route
                path="vip-tours/yacht-boat"
            element={
              <MainLayout>
                <VipToursPage categoryFilter="yacht-boat" />
              </MainLayout>
            }
          />
          <Route
                path="vip-tours/medical"
            element={
              <MainLayout>
                <VipToursPage categoryFilter="medical" />
              </MainLayout>
            }
          />
          <Route
                path="vip-tours/sports"
            element={
              <MainLayout>
                <VipToursPage categoryFilter="sports" />
              </MainLayout>
            }
          />

              {/* Policy Pages */}
              <Route
                path="privacy-policy"
                element={
                  <MainLayout>
                    <PrivacyPolicy />
                  </MainLayout>
                }
              />
              <Route
                path="terms-conditions"
                element={
                  <MainLayout>
                    <TermsConditions />
                  </MainLayout>
                }
              />
              <Route
                path="cancellation-policy"
                element={
                  <MainLayout>
                    <CancellationPolicy />
                  </MainLayout>
                }
              />

          {/* Transfer Submenu Routes */}
          <Route
                path="transfer/airport"
            element={
              <MainLayout>
                <TransferPage initialTransferType="airport" />
              </MainLayout>
            }
          />
          <Route
                path="transfer/intercity"
            element={
              <MainLayout>
                <TransferPage initialTransferType="intercity" />
              </MainLayout>
            }
          />
          <Route
                path="transfer/city"
            element={
              <MainLayout>
                <TransferPage initialTransferType="city" />
              </MainLayout>
            }
          />
          <Route
                path="transfer/payment"
            element={
              <MainLayout>
                <PaymentPage />
              </MainLayout>
            }
          />
            </Route>
          ))}

          {/* Redirect any non-language-prefixed routes to default language */}
          <Route path="/*" element={<Navigate to={`/${i18nInstance.language}/*`} replace />} />
        </Routes>
      </Router>
    </I18nextProvider>
  );
}

export default App;
