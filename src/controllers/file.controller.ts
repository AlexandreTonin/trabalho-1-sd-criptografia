import type { Request, Response } from 'express';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storagePath = path.join(__dirname, '..', '..', 'storage');

type ListedFile = {
  name: string;
  size: number;
  createdAt: string;
};

export default class FileController {
  public static async findAll(_req: Request, res: Response) {
    const files = await FileController.readFilesFromStorage();

    res.render('files', {
      files,
    });
  }
  public static findById(req: Request, res: Response) {}
  public static create(req: Request, res: Response) {
    if (!req.file) {
      res.status(400).send('Nenhum arquivo enviado.');
      return;
    }

    res.redirect('/files');
  }
  public static update(req: Request, res: Response) {}
  public static delete(req: Request, res: Response) {}

  private static async readFilesFromStorage(): Promise<ListedFile[]> {
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
}
