import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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

  public static getFilePath(filename: string): string {
    return path.join(storagePath, filename);
  }

  public static async delete(filename: string): Promise<void> {
    await fs.unlink(path.join(storagePath, filename));
  }
}
