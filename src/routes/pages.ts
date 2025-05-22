import path from 'path';
import mime from 'mime-types';
import express, { Request, Response } from 'express';

const __dirname=process.cwd();

export const pages=express.Router();

pages.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, path) => {
    res.setHeader(
      'Content-Type',
      mime.lookup(path) || 'application/octet-stream'
    );
    res.setHeader('Cache-Control', 'no-store, max-age=0'); // Disable caching
  },
}));

pages.get("/",(req:Request,res:Response)=>{
  res.sendFile(__dirname+"/public/index.html");

});