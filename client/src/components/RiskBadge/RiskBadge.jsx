import { useLanguage } from "../../context/LanguageContext";
import "./RiskBadge.css";

const ICONS = {
  safe: "✓",
  warning: "⚠",
  danger: "!",
};

function RiskBadge({ level = "safe", size = "md" }) {
  const { t } = useLanguage();
  const normalized = ["safe", "warning", "danger"].includes(level)
    ? level
    : "safe";

  return (
    <div
      className={`risk-badge risk-${normalized} risk-badge--${size} ${
        normalized !== "safe" ? "pulse" : ""
      }`}
    >
      <span className="risk-badge__icon">{ICONS[normalized]}</span>
      <div className="risk-badge__text">
        <span className="risk-badge__label">{t(`risk.${normalized}`)}</span>
        <span className="risk-badge__sub">{t(`risk.${normalized}Sub`)}</span>
      </div>
    </div>
  );
}

export default RiskBadge;
