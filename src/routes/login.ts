import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt'

import { emptyCookie, generateAndSerializeToken } from '../middlewares/cookies.js';
import { Logger } from '../helpers/Logger.js';
import { User } from '../db/user.js';

const login = express.Router();

login.post('/', async (req:Request, res:Response) => {
  const { password,email } = req.body;

  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    res.status(401).json({ 
      ok: false, 
      message: "Email or password incorrect" 
    });
    return
  }

  const isPasswordCorrect=bcrypt.compareSync(password,existingUser.password)

  if(!isPasswordCorrect){
    res.status(401).json({
      ok: false,
      message: `Email or password incorrect`,
    });
    return
  }

  try {
    const token = generateAndSerializeToken(email)
    res.setHeader('Set-Cookie', token).json({
      ok: true,
      message: "Access Granted",
    });
  }
  catch (e) {
    res.status(401).json({
      ok: false,
      message: `Invalid Password`,
    });
  }
});

login.post('/signin', async (req:Request, res:Response) => {
  let { password,email } = req.body;

  if(typeof password!=='string'||typeof email!=='string'){
    res.status(400).json({
      ok:false,
      message:"Email and password must be strings"
    })
    return
  }

  if(password.length<=8){
      res.status(400).json({
      ok:false,
      message:"Password is too weak"
    })
    return
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ 
        ok: false, 
        message: "Email already in use" 
      });
      return
    }

    password= bcrypt.hashSync(password,10)

    // const farFutureDate = new Date(3000, 0, 1); //admin only
    // const user=new User({email,password,expirationDate:farFutureDate})
    const user=new User({email,password})
    await user.save();

    const token=generateAndSerializeToken(email)
    res.setHeader('Set-Cookie', token).status(201).json({
      ok: true,
      message: "User created",
      user:{ id: user._id, email: user.email}
    });
    Logger.info("new user created",email)
  }
  catch (e) {
    res.json({
      ok: false,
      message: `sign up error`,
    });
    Logger.error("sign up error",e)
  }
});

login.get('/logout',async (req, res) => {
  const serialized = await emptyCookie();
  // Set the cleared cookie in the response header
  res.setHeader('Set-Cookie', serialized);

  // Send a response
  res.redirect('/login');
});

export { login };