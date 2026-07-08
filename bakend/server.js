const express = require("express");
const userRoutes = require("./routes/userRoutes.js");
const app = express();
app.use(express.json());
// simple CORS middleware for local dev
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});
app.use("/api/user", userRoutes);
app.use("/health", (req, res) => res.json({ status: "ok" }));
// 404 for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

// global error handler
app.use((err, req, res, next) => {
  console.error(err && err.stack ? err.stack : err);
  res.status(500).json({ message: "Internal Server Error" });
});

app.listen(5000, () => {
  console.log("app is running on 5000");
});
