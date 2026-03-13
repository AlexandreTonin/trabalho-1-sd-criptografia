import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import CryptoService from './crypto.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storagePath = path.join(__dirname, '..', '..', 'storage');

export type ListedFile = {
  name: string;
  size: number;
  createdAt: string;
};

export default class FileService {
  public static async findAll(): Promise<ListedFile[]> {
    const entries = await fs.readdir(storagePath, { withFileTypes: true });

    const files = await Promise.all(
      entries
        .filter((entry) => entry.isFile())
        .map(async (entry) => {
          const fullPath = path.join(storagePath, entry.name);
          const stats = await fs.stat(fullPath);

          return {
            name: entry.name,
            size: stats.size,
            createdAt: stats.birthtime.toLocaleString('pt-BR'),
          };
        }),
    );

    return files.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  public static async create(file: Express.Multer.File): Promise<void> {
    const encryptionKey = process.env['FILE_ENCRYPTION_KEY'];

    if (!encryptionKey) {
      throw new Error('FILE_ENCRYPTION_KEY não definida no ambiente.');
    }

    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = unique + path.extname(file.originalname);
    const destPath = path.join(storagePath, filename);

    const encrypted = CryptoService.encryptBuffer(file.buffer, encryptionKey);

    await fs.writeFile(destPath, encrypted);
  }

  public static async download(filename: string, key: string): Promise<Buffer> {
    const encryptionKey = process.env['FILE_ENCRYPTION_KEY'];

    if (!encryptionKey) {
      throw new Error('FILE_ENCRYPTION_KEY não definida no ambiente.');
    }

    if (key !== encryptionKey) {
      throw new InvalidKeyError();
    }

    const filePath = path.join(storagePath, filename);
    const encrypted = await fs.readFile(filePath);

    return CryptoService.decryptBuffer(encrypted, encryptionKey);
  }

  public static async delete(filename: string): Promise<void> {
    await fs.unlink(path.join(storagePath, filename));
  }
}

export class InvalidKeyError extends Error {
  constructor() {
    super('Chave de descriptografia inválida.');
    this.name = 'InvalidKeyError';
  }
}
