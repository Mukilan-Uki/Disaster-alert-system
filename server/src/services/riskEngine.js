const RISK_RULES = {
  flood: {
    conditions: (w) => w.rainfall1h >= 30 || w.rainfall3h >= 50,
    severity: (w) => (w.rainfall1h >= 50 ? "danger" : "warning"),
    title: "Flood Risk Alert",
    message:
      "Heavy rainfall detected. Avoid flood-prone areas and low-lying ground.",
  },
  cyclone: {
    conditions: (w) => w.windSpeed >= 60,
    severity: (w) => (w.windSpeed >= 90 ? "danger" : "warning"),
    title: "High Wind / Cyclone Alert",
    message: "Strong winds detected. Secure loose objects and stay indoors.",
  },
  heavyRain: {
    conditions: (w) => w.rainfall1h >= 15,
    severity: () => "warning",
    title: "Heavy Rain Warning",
    message: "Significant rainfall in your area. Drive carefully.",
  },
  heat: {
    conditions: (w) => w.temperature >= 38,
    severity: (w) => (w.temperature >= 42 ? "danger" : "warning"),
    title: "Extreme Heat Alert",
    message: "High temperature detected. Stay hydrated and avoid midday sun.",
  },
  landslide: {
    conditions: (w) => w.rainfall3h >= 80,
    severity: () => "danger",
    title: "Landslide Risk",
    message: "Prolonged heavy rain detected. Avoid steep slopes in hill areas.",
  },
};

function evaluateRisk(weatherData, userPreferences = {}) {
  const risks = [];

  for (const [type, rule] of Object.entries(RISK_RULES)) {
    if (userPreferences[type] === false) continue;
    if (rule.conditions(weatherData)) {
      risks.push({
        type,
        severity: rule.severity(weatherData),
        title: rule.title,
        message: rule.message,
      });
    }
  }

  const overallLevel = risks.some((r) => r.severity === "danger")
    ? "danger"
    : risks.some((r) => r.severity === "warning")
      ? "warning"
      : "safe";

  return { overallLevel, risks };
}

module.exports = { evaluateRisk, RISK_RULES };
