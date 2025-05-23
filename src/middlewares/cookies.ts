import  Jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import 'dotenv/config'
import { NextFunction, Request, Response } from 'express';

const SECRET=process.env.SECRET||"";
const IsProduction=process.env.nodeENV||"";

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
    secure: IsProduction=='development'?false:true,  //https only?
    httpOnly: true   
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
    return
  }

  const token =req.cookies.MyTokenName
  if(!token){
    denyAccess()
  }
  
  try {
    const payload = Jwt.verify(token, SECRET) as IPayload;
    if (payload?.ValidFrontEnd !== 'ValidFrontEnd') {
      denyAccess();

    }
    if (payload == undefined) {
      denyAccess();

    }
    if (payload?.ValidFrontEnd !== 'ValidFrontEnd') {
      denyAccess();

    }
  } catch (error) {
    denyAccess();
  }

  next()
}

export const preValidateToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.MyTokenName; // Optional chaining in case `req.cookies` is undefined
  if (!token) {
    next(); // No token → proceed to login
    return 
  }

  try {
    const payload = Jwt.verify(token, SECRET) as IPayload;
    if (payload?.ValidFrontEnd === 'ValidFrontEnd') {
      res.redirect('/chat'); // Valid token → redirect and STOP
      return
    }
  } catch (error) {
    next();
    return 
  }

  // Fallback (should not reach here if checks are correct)
  next();
};