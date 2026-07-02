import "dotenv/config";
import app from "./app.js";
import { connectDatabase } from "./config/database.js";
import { ensureAdminFromEnv } from "./scripts/ensureAdmin.js";

const PORT = process.env.PORT || 5000;

connectDatabase()
  .then(async () => {
    await ensureAdminFromEnv();

    app.listen(PORT, () => {
      console.log(`API running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  });
