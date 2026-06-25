const app = require("./app");
const connectDB = require("./config/db");
const { startWeatherMonitorJob } = require("./jobs/weatherMonitor");

const port = process.env.PORT || 5000;

connectDB()
  .then(() => {
    startWeatherMonitorJob();
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message || err);
    process.exit(1);
  });
