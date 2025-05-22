import express, { Request, Response } from 'express';
import { validatePassword } from '../middlewares/validatePassword';
import { generateAndSerializeToken } from '../middlewares/cookies';

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
      message: `Invalid Password: ${e}`,
    });
  }
});

export { login };