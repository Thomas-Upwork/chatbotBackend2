import path from 'path';
import mime from 'mime-types';
import express from 'express';
import { validateToken } from '../middlewares/cookies';
const __dirname = process.cwd();
export const pages = express.Router();
pages.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, path) => {
        res.setHeader('Content-Type', mime.lookup(path) || 'application/octet-stream');
    },
}));
pages.get("/", 
//preValidateToken,
(req, res) => {
    res.redirect('/çhat');
    // res.sendFile(__dirname+"/public/index.html");
});
pages.get("/chat", validateToken, (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});
