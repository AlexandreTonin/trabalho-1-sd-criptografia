import express from "express";
import { engine } from "express-handlebars";
import morgan from "morgan";
import path from "node:path";
import { fileURLToPath } from "node:url";
import FileController from "./controllers/file.controller.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(morgan("dev"));

app.engine(
  ".hbs",
  engine({
    extname: ".hbs",
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views", "layouts"),
  }),
);

app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "views"));

const router = express.Router();

router.get("/", FileController.findAll);
router.get("/:id", FileController.findById);
router.post("/", FileController.create);
router.put("/:id", FileController.update);
router.delete("/:id", FileController.delete);

app.use("/files", router);

app.get("/", (_req, res) => {
  res.redirect("/files");
});
