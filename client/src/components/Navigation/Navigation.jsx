import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Megaphone,
  Gauge,
  Bell,
  UserCog,
  ShieldHalf,
  MapPin,
  Info,
  Moon,
  Sun,
  Menu,
  X,
  TriangleAlert,
  Languages,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";
import appConfig from "../../config/appConfig";
import Button from "../ui/Button";

function NavLink({ to, children, onClick }) {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-full px-3 py-2 font-body text-sm font-medium transition-colors ${
        active
          ? "text-cyan-400"
          : "text-mist/80 hover:text-mist"
      }`}
    >
      {children}
    </Link>
  );
}

function Navigation() {
  const { isAuthenticated, user, logout } = useAuth();
  const { t, toggleLang } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-midnight-400/90 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold text-mist">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400/15 text-cyan-400">
            <Megaphone className="h-[18px] w-[18px]" />
          </span>
          {appConfig.shortName}
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          <NavLink to="/dashboard"><Gauge className="h-3.5 w-3.5" /> {t("nav.dashboard")}</NavLink>
          {isAuthenticated && (
            <>
              <NavLink to="/alerts"><Bell className="h-3.5 w-3.5" /> {t("nav.alerts")}</NavLink>
              <NavLink to="/profile"><UserCog className="h-3.5 w-3.5" /> {t("nav.profile")}</NavLink>
              {user?.role === "admin" && (
                <NavLink to="/admin"><ShieldHalf className="h-3.5 w-3.5" /> {t("nav.admin")}</NavLink>
              )}
            </>
          )}
          <NavLink to="/location/colombo"><MapPin className="h-3.5 w-3.5" /> {t("nav.preparedness")}</NavLink>
          <NavLink to="/about"><Info className="h-3.5 w-3.5" /> {t("nav.about")}</NavLink>
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <button
            onClick={toggleLang}
            aria-label="Toggle language"
            className="rounded-full p-2 text-mist/70 hover:bg-white/10 hover:text-mist"
          >
            <Languages className="h-4 w-4" />
          </button>
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="rounded-full p-2 text-mist/70 hover:bg-white/10 hover:text-mist"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {isAuthenticated ? (
            <>
              <span className="px-2 font-body text-sm text-mist/70">{user.name.split(" ")[0]}</span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>{t("nav.logout")}</Button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-2 font-body text-sm font-medium text-mist/80 hover:text-mist">
                {t("nav.login")}
              </Link>
              <Button as={Link} to="/register" size="sm">{t("nav.signup")}</Button>
            </>
          )}

          <a
            href={`tel:${appConfig.emergency.hotline}`}
            className="ml-1 flex items-center gap-1.5 rounded-full bg-danger-400/15 px-3 py-2 font-mono text-xs font-semibold text-danger-400"
          >
            <TriangleAlert className="h-3.5 w-3.5" /> {appConfig.emergency.hotline}
          </a>
        </div>

        <button
          className="rounded-full p-2 text-mist lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/10 lg:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-3">
              <NavLink to="/dashboard" onClick={() => setOpen(false)}>{t("nav.dashboard")}</NavLink>
              {isAuthenticated && (
                <>
                  <NavLink to="/alerts" onClick={() => setOpen(false)}>{t("nav.alerts")}</NavLink>
                  <NavLink to="/profile" onClick={() => setOpen(false)}>{t("nav.profile")}</NavLink>
                </>
              )}
              <NavLink to="/about" onClick={() => setOpen(false)}>{t("nav.about")}</NavLink>
              <div className="mt-2 flex gap-2">
                {isAuthenticated ? (
                  <Button variant="ghost" size="sm" onClick={handleLogout}>{t("nav.logout")}</Button>
                ) : (
                  <>
                    <Button as={Link} to="/login" variant="ghost" size="sm" onClick={() => setOpen(false)}>{t("nav.login")}</Button>
                    <Button as={Link} to="/register" size="sm" onClick={() => setOpen(false)}>{t("nav.signup")}</Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navigation;
