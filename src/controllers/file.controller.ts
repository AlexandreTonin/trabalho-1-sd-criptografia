import type { Request, Response } from 'express';
import FileService from '../services/file.service.js';

export default class FileController {
  public static async findAll(_req: Request, res: Response) {
    const files = await FileService.findAll();

    res.render('files', { files });
  }

  public static download(req: Request, res: Response) {
    const filename = Array.isArray(req.params['id'])
      ? req.params['id'][0]
      : req.params['id'];

    if (!filename) {
      res.status(400).send('ID do arquivo não informado.');
      return;
    }

    const filePath = FileService.getFilePath(filename);

    res.download(filePath, filename, (err) => {
      if (err) {
        res.status(404).send('Arquivo não encontrado.');
      }
    });
  }

  public static create(req: Request, res: Response) {
    if (!req.file) {
      res.status(400).send('Nenhum arquivo enviado.');
      return;
    }

    res.redirect('/files');
  }

  public static async delete(req: Request, res: Response) {
    const filename = Array.isArray(req.params['id'])
      ? req.params['id'][0]
      : req.params['id'];

    if (!filename) {
      res.status(400).send('ID do arquivo não informado.');
      return;
    }

    await FileService.delete(filename);
    res.redirect('/files');
  }
}
