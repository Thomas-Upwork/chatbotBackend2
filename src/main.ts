
import express from "express";
import {Request, Response} from 'express';
import 'dotenv/config'

import { LLMcall } from "./models/llama3call.js";
// import { LLMcall } from "./models/openaiCall.js";

// import { messages } from "./fakeInput";
import { limiter } from "./middlewares/rateLimit.js";
import { login } from "./routes/login.js";
import { systemPrompt } from "./systemPrompt.js";

const app=express();

const PORT=process.env.PORT??4200;

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/login',limiter,login)

//I don't want to move this to other file because it is easier now to switch between models
//to switch between llama 3 or openai you just need to change the file where it is being imported
app.post("/api/chat",limiter,async (req:Request,res:Response)=>{
  const {messages}=req.body;
  messages.unshift(systemPrompt)

  //TODO: sanitize messages
  try{
    const LLMresponse=await LLMcall(messages)
    // res.json({content:"I don't know how to answer that"});
    res.json({
      ok:true,
      content:LLMresponse.content
    })
  }
  catch (e){
    res.json({
      ok:false,
      content:"I don't know how to answer that"
    })
  }

});

app.listen(PORT,(err)=>{
  if (err) {
    console.log(err);
  } else {
    console.log(`Server started on http://localhost:${PORT}`);
  }
});
