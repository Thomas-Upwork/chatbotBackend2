import path from 'path';
import mime from 'mime-types';
import express, { Request, Response } from 'express';
import { validateToken } from '../middlewares/cookies.js';

const __dirname=process.cwd();

export const pages=express.Router();

pages.get("/",(req:Request,res:Response)=>{
  res.redirect("/chat")
});

pages.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, path) => {
    res.setHeader(
      'Content-Type',
      mime.lookup(path) || 'application/octet-stream'
    );
  },
}));

pages.get("/user", validateToken, (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

pages.get("/chat", validateToken, (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

pages.get("/login", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

pages.get("/*foo", validateToken, (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
