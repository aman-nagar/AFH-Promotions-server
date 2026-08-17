import "dotenv/config";

import app from "./app.js";
import { connectDatabase } from "./config/database.js";
import { seedOffers } from "./config/seed.js";

const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectDatabase();
  await seedOffers();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();