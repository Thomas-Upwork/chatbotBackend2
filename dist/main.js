var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
import express from "express";
import path from 'path';
import mime from 'mime-types';
import 'dotenv/config';
// import { messages } from "./fakeInput";
import { LLMcall } from "./LLMcall.js";
import { limiter } from "./middlewares/rateLimit.js";
const app = express();
const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 4200;
const __dirname = process.cwd();
app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, path) => {
        res.setHeader('Content-Type', mime.lookup(path) || 'application/octet-stream');
        res.setHeader('Cache-Control', 'no-store, max-age=0'); // Disable caching
    },
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});
app.post("/api/chat", limiter, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { messages } = req.body;
    const LLMresponse = yield LLMcall(messages);
    // res.json({content:"I don't know how to answer that"});
    res.json({
        ok: true,
        content: LLMresponse.content
    });
}));
app.listen(PORT, (err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(`Server started on http://localhost:${PORT}`);
    }
});
