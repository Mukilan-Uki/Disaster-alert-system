const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const weatherRoutes = require("./routes/weatherRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/weather", weatherRoutes);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

module.exports = app;
