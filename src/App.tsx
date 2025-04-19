import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "./utils/i18n";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import VipToursPage from "./pages/VipToursPage";
import TransferPage from "./pages/TransferPage";
import PaymentPage from "./pages/PaymentPage";
import ChauffeurPage from "./pages/ChauffeurPage";
import ContactPage from "./pages/ContactPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  useEffect(() => {
    // Set initial language direction on mount
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <Router>
        <Routes>
          {/* Main Routes */}
          <Route
            path="/"
            element={
              <MainLayout>
                <HomePage />
              </MainLayout>
            }
          />
          <Route
            path="/vip-tours"
            element={
              <MainLayout>
                <VipToursPage />
              </MainLayout>
            }
          />
          <Route
            path="/transfer"
            element={
              <MainLayout>
                <TransferPage />
              </MainLayout>
            }
          />
          <Route
            path="/chauffeur"
            element={
              <MainLayout>
                <ChauffeurPage />
              </MainLayout>
            }
          />
          <Route
            path="/contact"
            element={
              <MainLayout>
                <ContactPage />
              </MainLayout>
            }
          />

          {/* VIP Tours Submenu Routes */}
          <Route
            path="/vip-tours/cultural-historical"
            element={
              <MainLayout>
                <VipToursPage categoryFilter="cultural-historical" />
              </MainLayout>
            }
          />
          <Route
            path="/vip-tours/shopping-entertainment"
            element={
              <MainLayout>
                <VipToursPage categoryFilter="shopping-entertainment" />
              </MainLayout>
            }
          />
          <Route
            path="/vip-tours/nature-excursion"
            element={
              <MainLayout>
                <VipToursPage categoryFilter="nature-excursion" />
              </MainLayout>
            }
          />
          <Route
            path="/vip-tours/yacht-boat"
            element={
              <MainLayout>
                <VipToursPage categoryFilter="yacht-boat" />
              </MainLayout>
            }
          />
          <Route
            path="/vip-tours/medical"
            element={
              <MainLayout>
                <VipToursPage categoryFilter="medical" />
              </MainLayout>
            }
          />
          <Route
            path="/vip-tours/sports"
            element={
              <MainLayout>
                <VipToursPage categoryFilter="sports" />
              </MainLayout>
            }
          />

          {/* Transfer Submenu Routes */}
          <Route
            path="/transfer/airport"
            element={
              <MainLayout>
                <TransferPage initialTransferType="airport" />
              </MainLayout>
            }
          />
          <Route
            path="/transfer/intercity"
            element={
              <MainLayout>
                <TransferPage initialTransferType="intercity" />
              </MainLayout>
            }
          />
          <Route
            path="/transfer/city"
            element={
              <MainLayout>
                <TransferPage initialTransferType="city" />
              </MainLayout>
            }
          />
          <Route
            path="/transfer/payment"
            element={
              <MainLayout>
                <PaymentPage />
              </MainLayout>
            }
          />

          {/* Chauffeur Submenu Routes */}
          <Route
            path="/chauffeur"
            element={
              <MainLayout>
                <ChauffeurPage />
              </MainLayout>
            }
          />

          {/* 404 Route */}
          <Route
            path="*"
            element={
              <MainLayout>
                <NotFoundPage />
              </MainLayout>
            }
          />
        </Routes>
      </Router>
    </I18nextProvider>
  );
}

export default App;
