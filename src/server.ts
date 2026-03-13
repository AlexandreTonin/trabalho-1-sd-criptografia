import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { app } from "./app.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storagePath = path.join(__dirname, "..", "storage");

async function bootstrap() {
  await fs.mkdir(storagePath, { recursive: true });

  app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
  });
}

bootstrap();
