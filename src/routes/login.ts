import express, { Request, Response } from 'express';
import { validatePassword } from '../middlewares/validatePassword.js';
import { emptyCookie, generateAndSerializeToken } from '../middlewares/cookies.js';
import { serialize } from 'cookie';

const login = express.Router();

login.post('/', async (req:Request, res:Response) => {
  const { password } = req.body;
  try {
    const token =await generateAndSerializeToken()
    await validatePassword(password);
    res.setHeader('Set-Cookie', token).json({
      ok: true,
      message: "Access Granted",
    });
  }
  catch (e) {
    res.json({
      ok: false,
      message: `Invalid Password`,
    });
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