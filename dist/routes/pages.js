import path from 'path';
import mime from 'mime-types';
import express from 'express';
import { validateToken } from '../middlewares/cookies.js';
const __dirname = process.cwd();
export const pages = express.Router();
pages.get("/", (req, res) => {
    res.redirect("/chat");
});
pages.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, path) => {
        res.setHeader('Content-Type', mime.lookup(path) || 'application/octet-stream');
    },
}));
pages.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});
pages.get("/chat", validateToken, (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});
//These won't work
// pages.get("/*", (req: Request, res: Response) => {
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });
// pages.get("*", (req:Request,res:Response) => {
//   res.json({
//     message: "page not found"
//   })
// });
