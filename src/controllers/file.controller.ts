import type { Request, Response } from 'express';
import FileService, { InvalidKeyError } from '../services/file.service.js';
import path from 'node:path';

export default class FileController {
  public static async findAll(req: Request, res: Response) {
    const files = await FileService.findAll();
    const hasAccessDeniedError = req.query['error'] === 'access-denied';

    res.render('files', {
      files,
      hasAccessDeniedError,
    });
  }

  public static async download(req: Request, res: Response) {
    const filename = Array.isArray(req.params['id'])
      ? req.params['id'][0]
      : req.params['id'];

    const rawKey = req.query['key'];
    const key = typeof rawKey === 'string' ? rawKey : undefined;

    if (!filename) {
      res.status(400).send('ID do arquivo não informado.');
      return;
    }

    if (!key) {
      res.status(400).send('Chave de descriptografia não informada.');
      return;
    }

    try {
      const buffer = await FileService.download(filename, key);

      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${path.basename(filename)}"`,
      );
      res.setHeader('Content-Type', 'application/octet-stream');
      res.send(buffer);
    } catch (err) {
      if (err instanceof InvalidKeyError) {
        res.redirect('/files?error=access-denied');
        return;
      }

      res.status(404).send('Arquivo não encontrado.');
    }
  }

  public static async create(req: Request, res: Response) {
    if (!req.file) {
      res.status(400).send('Nenhum arquivo enviado.');
      return;
    }

    await FileService.create(req.file);
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
