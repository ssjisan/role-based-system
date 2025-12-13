const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const pageRoutes = require("./routes/pageRoutes.js");
const roleRoutes = require("./routes/roleRoutes.js");
const authRoutes = require("./routes/authRoutes.js");
const dashboardRoutes = require("./routes/dashboardRoutes.js");
const pageGroupRoutes = require("./routes/pageGroupRoutes.js");
dotenv.config();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use(pageRoutes);
app.use(roleRoutes);
app.use(authRoutes);
app.use(dashboardRoutes);
app.use(pageGroupRoutes);
app.get("/", (req, res) => {
  res.send(webMessage);
});
const port = process.env.PORT;
// Connect database and start server + cron job
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");

    // Start the Express server
    app.listen(port, () => {
      console.log(`🔊 Server running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
  });
