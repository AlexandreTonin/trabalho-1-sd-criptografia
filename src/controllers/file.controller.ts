import type { Request, Response } from "express";

export default class FileController {
  public static findAll(req: Request, res: Response) {
    res.render("files", {
      files: [
        { name: "Arquivo 1", size: 1024, createdAt: "01/01/2001" },
        { name: "Arquivo 2", size: 2048, createdAt: "01/01/2001" },
        { name: "Arquivo 3", size: 512, createdAt: "01/01/2001" },
        { name: "Arquivo 4", size: 512, createdAt: "01/01/2001" },
        { name: "Arquivo 5", size: 512, createdAt: "01/01/2001" },
        { name: "Arquivo 6", size: 512, createdAt: "01/01/2001" },
        { name: "Arquivo 7", size: 512, createdAt: "01/01/2001" },
        { name: "Arquivo 8", size: 512, createdAt: "01/01/2001" },
      ],
    });
  }
  public static findById(req: Request, res: Response) {}
  public static create(req: Request, res: Response) {}
  public static update(req: Request, res: Response) {}
  public static delete(req: Request, res: Response) {}
}
