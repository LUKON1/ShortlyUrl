import "/src/style.css";
import { Routes, Route } from "react-router-dom";
import Registrpage from "./Pages/!Registrpage.jsx";
import Footer from "./layout/footer.jsx";
import Homepage from "./Pages/!Homepage.jsx";
import Header_bar from "./layout/header_bar.jsx";
import PrivateRoute from "./Pages/PrivateRoute.jsx";
import Myurlspage from "./Pages/!Myurlspage.jsx";
import Aboutpage from "./Aboutpage.jsx";
import Signinpage from "./Pages/!Signinpage.jsx";
import useAuthOnLoading from "../utils/useAuthOnLoading.js"
import AppLoader from "./shared/AppLoader.jsx";
import { ThemeProvider } from "../context/ThemeProvider.jsx";

function App() {

  const isLoadingAuth = useAuthOnLoading();
  if(isLoadingAuth){
    return(
      <ThemeProvider>
        <div className="flex flex-col w-screen min-h-screen items-center justify-center bg-rose-50 dark:bg-slate-900">
          <AppLoader/>
        </div>
      </ThemeProvider>
    )
  }
  return (
    <ThemeProvider>
      <div className="flex flex-col w-screen min-h-screen bg-rose-50 dark:bg-slate-900">
        <Header_bar />
        <main className="flex flex-col grow">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/about" element={<Aboutpage />}/>
            <Route path="/myurls" element={
             <PrivateRoute>
              <Myurlspage />
             </PrivateRoute>
            }/>
            <Route path="/registration" element={<Registrpage />}/>
            <Route path="/signin" element={<Signinpage />}/>
          </Routes>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
export default App;
