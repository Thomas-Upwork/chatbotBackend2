import  Jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import 'dotenv/config'
import { NextFunction, Request, Response } from 'express';

const SECRET=process.env.SECRET||"";

interface IPayload {
  ValidFrontEnd:string
}

export const generateAndSerializeToken=async()=>{
  const payload = {
    ValidFrontEnd:"ValidFrontEnd",
  };
  const token = Jwt.sign(payload,SECRET,{
    expiresIn:"48h"
  })   

  const serialized=serialize("MyTokenName",token,{
    path:"/",
    maxAge: 60*60*48, //this are secconds, don't trust anyone telling the opposite
    sameSite:'strict', //prevents cross site reques forgery
    secure: false
    //httpsOnly: true   //ideally have to check the .env to see if I'm in production environment
  })

  return serialized;
}

export const validateToken=async(req:Request, res:Response,next:NextFunction)=>{

  const denyAccess=()=>{
    if(req.method=='GET'){
      res.redirect('/')
    }
    else{
      res.json({
        ok:false,
        message:"forbidden"
      })
    }
  }

  const token =req.cookies.MyTokenName
  if(!token){
    denyAccess()
    return;
  }
  
  const payload=Jwt.verify(token,SECRET) as IPayload

  if(payload==undefined){
    denyAccess()
    return;
  }
  if (payload?.ValidFrontEnd!== 'ValidFrontEnd') {
    denyAccess()
    return;
  }

  next()
}
