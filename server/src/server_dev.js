process.env.PORT = process.env.PORT || "5001";
const app = require("./app");
const connectDB = require("./config/db");
const { startWeatherMonitorJob } = require("./jobs/weatherMonitor");
const port = process.env.PORT;

connectDB()
  .then(() => {
    startWeatherMonitorJob();
    app.listen(port, () => {
      console.log(`Dev server listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message || err);
    process.exit(1);
  });
