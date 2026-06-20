// Small helper utilities used across the frontend

export function formatTemperature(celsius) {
  if (celsius == null) return "-";
  return `${Math.round(celsius)}°C`;
}

export function toTitleCase(str = "") {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(),
  );
}
