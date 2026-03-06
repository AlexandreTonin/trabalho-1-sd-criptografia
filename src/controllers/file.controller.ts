import type { Request, Response } from "express";

export default class FileController {
  public static findAll(req: Request, res: Response) {
    res.render("files", { message: "teste" });
  }
  public static findById(req: Request, res: Response) {}
  public static create(req: Request, res: Response) {}
  public static update(req: Request, res: Response) {}
  public static delete(req: Request, res: Response) {}
}
