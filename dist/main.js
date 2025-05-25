var _a;
import express from "express";
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import { limiter, strictLimiter } from "./middlewares/rateLimit.js";
import { login } from "./routes/login.js";
import { chat } from "./routes/chat.js";
import { pages } from "./routes/pages.js";
const app = express();
const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 4200;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api/login', strictLimiter, login);
app.use('/api/chat', limiter, chat);
app.use('/', limiter, pages);
//This endpoint is to test the abortion from the client
// app.post('/api/abort',()=>{
//   console.log('abort endpoint hit')
// })
app.listen(PORT, (err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(`Server started on http://localhost:${PORT}`);
    }
});
