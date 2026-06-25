const cron = require("node-cron");
const { runWeatherMonitor } = require("../services/weatherMonitorService");
const { configureWebPush } = require("../services/notificationService");

const CRON_SCHEDULE = process.env.WEATHER_CRON || "*/15 * * * *";

function startWeatherMonitorJob() {
  configureWebPush();

  if (process.env.ENABLE_WEATHER_CRON === "false") {
    console.log("[WeatherMonitor] Cron disabled via ENABLE_WEATHER_CRON=false");
    return;
  }

  cron.schedule(CRON_SCHEDULE, async () => {
    try {
      await runWeatherMonitor();
    } catch (err) {
      console.error("[WeatherMonitor] Cron error:", err.message || err);
    }
  });

  console.log(`[WeatherMonitor] Scheduled: ${CRON_SCHEDULE}`);
}

module.exports = { startWeatherMonitorJob };
