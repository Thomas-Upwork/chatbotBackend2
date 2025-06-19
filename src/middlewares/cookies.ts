import  Jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import 'dotenv/config'
import { NextFunction, Request, Response } from 'express';
import { User } from '../db/user';
import { Logger } from '../helpers/Logger';

if (!process.env.SECRET) {
  throw new Error('SECRET environment variable is required');
}
const SECRET=process.env.SECRET;
const isDevelopment=process.env.NODE_ENV||"";

export interface IPayload {
  ValidFrontEnd:string,
  email:string,
  renewCookieAfter:Date
}

export const generateAndSerializeToken = (email:string):string=>{

  const now = new Date();
  const renewCookieAfter = new Date(now);//copy to prevent mutation
  renewCookieAfter.setHours(now.getHours() + 2);  // Fixed: Properly adds 2 hours

  const payload = {
    ValidFrontEnd:"ValidFrontEnd",
    email,
    renewCookieAfter:renewCookieAfter.toISOString(),
    iat: Math.floor(now.getTime() / 1000)  //
  };
  const token = Jwt.sign(payload,SECRET,{
    expiresIn:"48h",
    
  })   

  const serialized= serialize("MyTokenName",token,{
    path:"/",
    maxAge: 60*60*48, //this are secconds, don't trust anyone telling the opposite
    sameSite:'strict', //prevents cross site reques forgery
    secure: isDevelopment=='development'?false:true,  //https only?
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
    Logger.error('token not found')
    return denyAccess();  // Added return
  }
  
  try {
    const payload = Jwt.verify(token, SECRET) as IPayload;
    
    if (!payload || payload?.ValidFrontEnd !== 'ValidFrontEnd') {
      Logger.error('Payload not found')
      return denyAccess();  // Added return
    }

    const today=new Date()
    if(new Date(payload.renewCookieAfter)<today){ //expired
      const user=await User.findOne({email:payload.email})

      if(user==null){
        Logger.error('User not found')
        denyAccess()
        return
      }

      if(user?.expirationDate==undefined||user?.expirationDate==null){
        Logger.error('Payment required from user',user.email)
        res.status(402).json({
          ok:false,
          message:"Payment required"
        })
        return
      }

      if(user?.expirationDate<today){ //subscription finished
        Logger.error('Payment required from user',user.email)
        res.status(402).json({
          ok:false,
          message:"Payment required"
        })
        return
      }

      if(user?.expirationDate>today){ //subscription not finished
        Logger.info('Cookie updated')
        const newToken=generateAndSerializeToken(user.email)
        res.setHeader('Set-Cookie', newToken)
      }
    }
    
    next();  // Only call next if validation succeeds
  } catch (error) {
    return denyAccess();  // Added return
  }
}

export const emptyCookie: () => Promise<string>=async()=>{
  const serialized=serialize("MyTokenName","",{
    path:"/",
    maxAge: 0, //this are secconds, don't trust anyone telling the opposite
    sameSite:'strict', //prevents cross site reques forgery
    secure: isDevelopment=='development'?false:true,  //https only?
    httpOnly: true   
  })

  return serialized;
}
