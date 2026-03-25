import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Dynamic import so env vars are loaded before any module reads them
async function main() {
  const express = (await import("express")).default;
  const cors = (await import("cors")).default;
  const routes = (await import("./routes")).default;

  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use("/api", routes);

  app.listen(5000, () => {
    console.log("Server running on port 5000");
  });
}

main();