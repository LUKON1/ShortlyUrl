import "/src/style.css";
import { Routes, Route } from "react-router-dom";
import { motion } from "motion/react";
import { lazy, Suspense, useEffect } from "react";
import Header_bar from "./layout/header_bar.jsx";
import PrivateRoute from "./Pages/PrivateRoute.jsx";
import useAuthOnLoading from "../utils/useAuthOnLoading.js";
import AppLoader from "./shared/AppLoader.jsx";
import { ThemeProvider } from "../context/ThemeProvider.jsx";
import { OfflineProvider } from "../context/OfflineProvider.jsx";
import OfflineModal from "./shared/OfflineModal.jsx";
import { CLIENT_ROUTES } from "../utils/clientRoutes.js";
import { useOffline } from "../context/OfflineProvider.jsx";
import BackgroundEffect from "./layout/BackgroundEffect.jsx";

// Lazy loading pages
const Homepage = lazy(() => import("./Pages/!Homepage.jsx"));
const Registrpage = lazy(() => import("./Pages/!Registrpage.jsx"));
const Myurlspage = lazy(() => import("./Pages/!Myurlspage.jsx"));
const PrivacyPolicyPage = lazy(() => import("./PrivacyPolicyPage.jsx"));
const Signinpage = lazy(() => import("./Pages/!Signinpage.jsx"));
const SharePage = lazy(() => import("./Pages/SharePage.jsx"));
const PausedPage = lazy(() => import("./Pages/PausedPage.jsx"));
const ExpiredPage = lazy(() => import("./Pages/ExpiredPage.jsx"));
const AboutPage = lazy(() => import("./Pages/AboutPage.jsx"));
const FeaturesPage = lazy(() => import("./Pages/FeaturesPage.jsx"));
const FAQPage = lazy(() => import("./Pages/FAQPage.jsx"));
const ContactPage = lazy(() => import("./Pages/ContactPage.jsx"));
const Footer = lazy(() => import("./layout/footer.jsx"));
const NotFound = lazy(() => import("./Pages/NotFound.jsx"));

function AppContent() {
  const { isOfflineModalOpen, showOfflineModal, hideOfflineModal } = useOffline();

  // Передаем контекст в window для использования в interceptors
  useEffect(() => {
    window.offlineContext = { showOfflineModal, hideOfflineModal };
    return () => {
      window.offlineContext = null;
    };
  }, [showOfflineModal, hideOfflineModal]);

  return (
    <>
      <Header_bar />
      <main className="flex grow flex-col pt-20 md:pt-30 lg:pt-40">
        <Suspense
          fallback={
            <div className="flex h-[50vh] w-full items-center justify-center">
              <AppLoader />
            </div>
          }
        >
          <Routes>
            <Route path={CLIENT_ROUTES.HOME} element={<Homepage />} />
            <Route path={CLIENT_ROUTES.PRIVACY} element={<PrivacyPolicyPage />} />
            <Route path={CLIENT_ROUTES.PAUSED} element={<PausedPage />} />
            <Route path={CLIENT_ROUTES.EXPIRED} element={<ExpiredPage />} />
            <Route path={CLIENT_ROUTES.ABOUT} element={<AboutPage />} />
            <Route path={CLIENT_ROUTES.FEATURES} element={<FeaturesPage />} />
            <Route path={CLIENT_ROUTES.FAQ} element={<FAQPage />} />
            <Route path={CLIENT_ROUTES.CONTACT} element={<ContactPage />} />
            <Route
              path={CLIENT_ROUTES.PROFILE}
              element={
                <PrivateRoute>
                  <Myurlspage />
                </PrivateRoute>
              }
            />
            <Route path={CLIENT_ROUTES.REGISTRATION} element={<Registrpage />} />
            <Route path={CLIENT_ROUTES.SIGNIN} element={<Signinpage />} />
            <Route path={`${CLIENT_ROUTES.SHARE}/:shareId`} element={<SharePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
      <OfflineModal />
    </>
  );
}

function App() {
  const isLoadingAuth = useAuthOnLoading();
  if (isLoadingAuth) {
    return (
      <ThemeProvider>
        <div className="flex min-h-screen w-screen flex-col items-center justify-center bg-white dark:bg-slate-900">
          <AppLoader />
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <OfflineProvider>
        <div
          className="relative flex min-h-screen w-screen flex-col bg-white dark:bg-slate-900"
          style={{ transition: "var(--transition-bg)" }}
        >
          <BackgroundEffect />
          <div className="relative z-10 flex min-h-screen w-full flex-col">
            <AppContent />
          </div>
        </div>
      </OfflineProvider>
    </ThemeProvider>
  );
}
export default App;
