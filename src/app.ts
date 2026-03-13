import express from 'express';
import { engine } from 'express-handlebars';
import morgan from 'morgan';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import FileController from './controllers/file.controller.js';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storagePath = path.join(__dirname, '..', 'storage');

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, storagePath);
  },

  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);

    cb(null, unique + path.extname(file.originalname));
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

export const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));

app.engine(
  '.hbs',
  engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
  }),
);

app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

const router = express.Router();

router.get('/', FileController.findAll);
router.get('/:id', FileController.download);
router.post('/', upload.single('file'), FileController.create);
router.delete('/:id', FileController.delete);

app.use('/files', router);

app.get('/', (_req, res) => {
  res.redirect('/files');
});
