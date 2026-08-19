import express from "express";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler.js";
import customerRoutes from "./routes/customer.routes.js";
import offerRoutes from "./routes/offer.routes.js";
import sessionRoutes from "./routes/session.routes.js";
import spinRoutes from "./routes/spin.routes.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://afh-promotions-production.up.railway.app",
  ...(process.env.FRONTEND_URL || "").split(","),
].map((origin) => origin.trim().replace(/\/$/, "")).filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Offer System API is running",
  });
});

// Mount routes
app.use("/api/customers", customerRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/spins", spinRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Not found",
    code: "NOT_FOUND",
  });
});

// Error handler middleware (must be last)
app.use(errorHandler);

export default app;