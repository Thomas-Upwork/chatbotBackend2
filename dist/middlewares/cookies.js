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
        if (req.method == 'GET') {
            res.redirect('/');
        }
        else {
            res.json({
                ok: false,
                message: "forbidden"
            });
        }
        return;
    };
    const token = req.cookies.MyTokenName;
    if (!token) {
        denyAccess();
    }
    try {
        const payload = Jwt.verify(token, SECRET);
        if ((payload === null || payload === void 0 ? void 0 : payload.ValidFrontEnd) !== 'ValidFrontEnd') {
            denyAccess();
        }
        if (payload == undefined) {
            denyAccess();
        }
        if ((payload === null || payload === void 0 ? void 0 : payload.ValidFrontEnd) !== 'ValidFrontEnd') {
            denyAccess();
        }
    }
    catch (error) {
        denyAccess();
    }
    next();
});
export const preValidateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.MyTokenName; // Optional chaining in case `req.cookies` is undefined
    if (!token) {
        next(); // No token → proceed to login
        return;
    }
    try {
        const payload = Jwt.verify(token, SECRET);
        if ((payload === null || payload === void 0 ? void 0 : payload.ValidFrontEnd) === 'ValidFrontEnd') {
            res.redirect('/chat'); // Valid token → redirect and STOP
            return;
        }
    }
    catch (error) {
        next();
        return;
    }
    // Fallback (should not reach here if checks are correct)
    next();
});
