var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from 'express';
import { validatePassword } from '../middlewares/validatePassword';
import { generateAndSerializeToken } from '../middlewares/cookies';
const login = express.Router();
login.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password } = req.body;
    try {
        const token = yield generateAndSerializeToken();
        yield validatePassword(password);
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
}));
export { login };
