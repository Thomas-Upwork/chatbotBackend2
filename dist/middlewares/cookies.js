var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import 'dotenv/config';
const SECRET = process.env.SECRET || "";
const IsProduction = process.env.nodeENV || "";
export const emptyCookie = () => __awaiter(void 0, void 0, void 0, function* () {
    const serialized = serialize("MyTokenName", "", {
        path: "/",
        maxAge: 0, //this are secconds, don't trust anyone telling the opposite
        sameSite: 'strict', //prevents cross site reques forgery
        secure: IsProduction == 'development' ? false : true, //https only?
        httpOnly: true
    });
    return serialized;
});
export const generateAndSerializeToken = () => __awaiter(void 0, void 0, void 0, function* () {
    const payload = {
        ValidFrontEnd: "ValidFrontEnd",
    };
    const token = Jwt.sign(payload, SECRET, {
        expiresIn: "48h"
    });
    const serialized = serialize("MyTokenName", token, {
        path: "/",
        maxAge: 60 * 60 * 48, //this are secconds, don't trust anyone telling the opposite
        sameSite: 'strict', //prevents cross site reques forgery
        secure: IsProduction == 'development' ? false : true, //https only?
        httpOnly: true
    });
    return serialized;
});
export const validateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const denyAccess = () => {
        if (req.method === 'GET') {
            res.redirect('/login'); // Added return
            return;
        }
        res.status(403).json({
            ok: false,
            message: "forbidden"
        });
        return;
    };
    const token = req.cookies.MyTokenName;
    if (!token) {
        return denyAccess(); // Added return
    }
    try {
        const payload = Jwt.verify(token, SECRET);
        if (!payload || (payload === null || payload === void 0 ? void 0 : payload.ValidFrontEnd) !== 'ValidFrontEnd') {
            return denyAccess(); // Added return
        }
        next(); // Only call next if validation succeeds
    }
    catch (error) {
        return denyAccess(); // Added return
    }
});
