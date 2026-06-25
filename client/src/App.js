import { useEffect } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation/Navigation";
import Footer from "./components/Footer/Footer";
import InstallPrompt from "./components/InstallPrompt/InstallPrompt";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing/Landing";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import AlertsHistory from "./pages/Alerts/AlertsHistory";
import ProfileSettings from "./pages/Profile/ProfileSettings";
import AdminPanel from "./pages/Admin/AdminPanel";
import LocationDetail from "./pages/LocationDetail/LocationDetail";
import NotFound from "./pages/Error/NotFound";
import ServerError from "./pages/Error/ServerError";
import Offline from "./pages/Error/Offline";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./components/ui";
import appConfig, { applyBrandTheme } from "./config/appConfig";
import "./styles/theme.css";
import "./App.css";

function App() {
  useEffect(() => {
    applyBrandTheme();
  }, []);

  return (
    <ThemeProvider>
      <ToastProvider>
        <Router>
          <div className="App min-h-screen bg-mist font-body dark:bg-midnight-400">
            <Navigation />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/home" element={<Dashboard />} />
                <Route
                  path="/alerts"
                  element={
                    <ProtectedRoute>
                      <AlertsHistory />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfileSettings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminPanel />
                    </ProtectedRoute>
                  }
                />
                <Route path="/location/:locationName" element={<LocationDetail />} />
                <Route
                  path="/about"
                  element={
                    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
                      <h1 className="font-display text-3xl font-bold text-midnight-400 dark:text-mist">
                        About {appConfig.name}
                      </h1>
                      <p className="mt-4 font-body text-midnight-400/70 dark:text-mist/70">
                        {appConfig.description}
                      </p>
                      <p className="mt-4 font-body text-sm text-midnight-400/50 dark:text-mist/50">
                        For real emergencies, contact the Disaster Management Centre at{" "}
                        <strong>{appConfig.emergency.hotline}</strong>.
                      </p>
                    </div>
                  }
                />
                <Route path="/500" element={<ServerError />} />
                <Route path="/offline" element={<Offline />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <InstallPrompt />
            <Footer />
          </div>
        </Router>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
