import "/src/style.css";
import { Routes, Route } from "react-router-dom";
import { motion } from "motion/react";
import Registrpage from "./Pages/!Registrpage.jsx";
import Footer from "./layout/footer.jsx";
import Homepage from "./Pages/!Homepage.jsx";
import Header_bar from "./layout/header_bar.jsx";
import PrivateRoute from "./Pages/PrivateRoute.jsx";
import Myurlspage from "./Pages/!Myurlspage.jsx";
import PrivacyPolicyPage from "./PrivacyPolicyPage.jsx";
import Signinpage from "./Pages/!Signinpage.jsx";
import SharePage from "./Pages/SharePage.jsx";
import PausedPage from "./Pages/PausedPage.jsx";
import ExpiredPage from "./Pages/ExpiredPage.jsx";
import useAuthOnLoading from "../utils/useAuthOnLoading.js";
import AppLoader from "./shared/AppLoader.jsx";
import { ThemeProvider } from "../context/ThemeProvider.jsx";
import { OfflineProvider } from "../context/OfflineProvider.jsx";
import OfflineModal from "./shared/OfflineModal.jsx";
import { CLIENT_ROUTES } from "../utils/clientRoutes.js";
import { useOffline } from "../context/OfflineProvider.jsx";
import { useEffect } from "react";

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
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path={CLIENT_ROUTES.PRIVACY} element={<PrivacyPolicyPage />} />
          <Route path={CLIENT_ROUTES.PAUSED} element={<PausedPage />} />
          <Route path={CLIENT_ROUTES.EXPIRED} element={<ExpiredPage />} />
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
        </Routes>
      </main>
      <Footer />
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
          className="flex min-h-screen w-screen flex-col bg-white dark:bg-slate-900"
          style={{ transition: "var(--transition-bg)" }}
        >
          <AppContent />
        </div>
      </OfflineProvider>
    </ThemeProvider>
  );
}
export default App;
