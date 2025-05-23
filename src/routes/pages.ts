import path from 'path';
import mime from 'mime-types';
import express, { Request, Response } from 'express';
import { preValidateToken, validateToken } from '../middlewares/cookies.js';

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
    // res.redirect('/chat')
  res.sendFile(__dirname+"/public/index.html");
});

pages.get("/chat",validateToken,(req:Request,res:Response)=>{
  res.sendFile(__dirname+"/public/index.html");
});