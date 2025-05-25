import  Jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import 'dotenv/config'
import { NextFunction, Request, Response } from 'express';

const SECRET=process.env.SECRET||"";
const IsProduction=process.env.nodeENV||"";

interface IPayload {
  ValidFrontEnd:string
}

export const emptyCookie: () => Promise<string>=async()=>{
  const serialized=serialize("MyTokenName","",{
    path:"/",
    maxAge: 0, //this are secconds, don't trust anyone telling the opposite
    sameSite:'strict', //prevents cross site reques forgery
    secure: IsProduction=='development'?false:true,  //https only?
    httpOnly: true   
  })

  return serialized;
}

export const generateAndSerializeToken: () => Promise<string>=async()=>{
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

export const validateToken = async (req: Request, res: Response, next: NextFunction) => {
  const denyAccess = () => {
    if (req.method === 'GET') {
      res.redirect('/login');  // Added return
      return 
    }
    res.status(403).json({    // Added return
      ok: false,
      message: "forbidden"
    });
    return 
  };

  const token = req.cookies.MyTokenName;
  if (!token) {
    return denyAccess();  // Added return
  }
  
  try {
    const payload = Jwt.verify(token, SECRET) as IPayload;
    
    if (!payload || payload?.ValidFrontEnd !== 'ValidFrontEnd') {
      return denyAccess();  // Added return
    }
    
    next();  // Only call next if validation succeeds
  } catch (error) {
    return denyAccess();  // Added return
  }
}
