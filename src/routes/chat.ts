import express, { Request, Response } from "express";

import { systemPrompt } from "../systemPrompt.js";
import { llama3call } from "../models/llama3call.js";
import { openaiCall } from "../models/openaiCall.js";

export const chat=express.Router();

chat.post("/llama3",async (req:Request,res:Response)=>{
// chat.post("/:model",async (req:Request,res:Response)=>{ 
  // const models={
  //   llama3:llama3call,
  //   openai:openaiCall
  // }
  // const model=req.params
  // function llmCall(model:typeof models,messages){
  //   models[model](messages)
  // }

  const {messages}=req.body;
  messages.unshift(systemPrompt)

  //TODO: sanitize messages
  try{
    const LLMresponse=await llama3call(messages)
    res.json({
      ok:true,
      content:LLMresponse.content
    })
  }
  catch (e){
    res.json({
      ok:false,
      content:"Sorry, I don't know how to answer that",
      message:`error: ${e}`
    })
  }

});

chat.post("/openai",async (req:Request,res:Response)=>{
  const {messages}=req.body;
  messages.unshift(systemPrompt)

  //TODO: sanitize messages
  try{
    const LLMresponse=await openaiCall(messages)
    res.json({
      ok:true,
      content:LLMresponse.content
    })
  }
  catch (e){
    res.json({
      ok:false,
      content:"Sorry, I don't know how to answer that",
      message:`error: ${e}`
    })
  }

});