import { resolve } from "node:path";
import { execSync } from "node:child_process";
import * as dotenv from "dotenv";

dotenv.config({ path: resolve(__dirname, "../.env.test") });

export default async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("Missing DATABASE_URL in .env.test");
  }

  try {
    execSync("yarn prisma db push --force-reset", {
      env: process.env,
      stdio: "inherit",
    });

    console.log("Test database setup complete!");
  } catch (error) {
    console.error("Failed to setup test database:", error);
    process.exit(1);
  }
};
