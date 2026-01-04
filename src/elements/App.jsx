import "/src/style.css";
import { Routes, Route } from "react-router-dom";
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
import useAuthOnLoading from "../utils/useAuthOnLoading.js";
import AppLoader from "./shared/AppLoader.jsx";
import { ThemeProvider } from "../context/ThemeProvider.jsx";

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
  //bg-slate-50 dark:bg-slate-900
  return (
    <ThemeProvider>
      <div className="flex min-h-screen w-screen flex-col">
        <Header_bar />
        <main className="flex grow flex-col">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/paused" element={<PausedPage />} />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Myurlspage />
                </PrivateRoute>
              }
            />
            <Route path="/registration" element={<Registrpage />} />
            <Route path="/signin" element={<Signinpage />} />
            <Route path="/share/:shortCode" element={<SharePage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
export default App;
