import { useState, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import "./InstallPrompt.css";

function InstallPrompt() {
  const { t } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem("pwa_dismissed") === "1"
  );
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    localStorage.setItem("pwa_dismissed", "1");
    setDismissed(true);
  };

  if (isInstalled || dismissed || !deferredPrompt) return null;

  return (
    <div className="install-prompt glass-card">
      <div className="install-prompt__content">
        <span className="install-prompt__icon">📲</span>
        <div>
          <strong>{t("install.title")}</strong>
          <p>{t("install.desc")}</p>
        </div>
      </div>
      <div className="install-prompt__actions">
        <button type="button" className="btn-primary-app" onClick={handleInstall}>
          {t("install.install")}
        </button>
        <button type="button" className="btn-outline-app" onClick={handleDismiss}>
          {t("install.dismiss")}
        </button>
      </div>
    </div>
  );
}

export default InstallPrompt;
