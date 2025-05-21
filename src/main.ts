
import express from "express";
import {Request, Response} from 'express';
import path from 'path';
import mime from 'mime-types';
import { ChatCompletionSystemMessageParam } from "groq-sdk/resources/chat/completions";
import 'dotenv/config'

// import { messages } from "./fakeInput";
import { LLMcall } from "./LLMcall.js";
import { limiter } from "./middlewares/rateLimit.js";

const app=express();

const PORT=process.env.PORT??4200;
const __dirname=process.cwd();

app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, path) => {
    res.setHeader(
      'Content-Type',
      mime.lookup(path) || 'application/octet-stream'
    );
    res.setHeader('Cache-Control', 'no-store, max-age=0'); // Disable caching
  },
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get("/",(req:Request,res:Response)=>{
  res.sendFile(__dirname+"/public/index.html");

});

app.post("/api/chat",limiter,async (req:Request,res:Response)=>{
  const {messages}=req.body;
  const LLMresponse=await LLMcall(messages as ChatCompletionSystemMessageParam[])
  // res.json({content:"I don't know how to answer that"});
  res.json({
    ok:true,
    content:LLMresponse.content
  })

});

app.listen(PORT,(err)=>{
  if (err) {
    console.log(err);
  } else {
    console.log(`Server started on http://localhost:${PORT}`);
  }
});
