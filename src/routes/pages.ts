import path from 'path';
import mime from 'mime-types';
import express, { Request, Response } from 'express';
import { limiter } from '../middlewares/rateLimit';
import { preValidateToken, validateToken } from '../middlewares/cookies';

const __dirname=process.cwd();

export const pages=express.Router();

pages.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, path) => {
    res.setHeader(
      'Content-Type',
      mime.lookup(path) || 'application/octet-stream'
    );
  },
}));

pages.get("/",
  //preValidateToken,
  (req:Request,res:Response)=>{
    res.redirect('/çhat')
  // res.sendFile(__dirname+"/public/index.html");
});

pages.get("/chat",validateToken,(req:Request,res:Response)=>{
  res.sendFile(__dirname+"/public/index.html");
});