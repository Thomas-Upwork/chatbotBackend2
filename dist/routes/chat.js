var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import { systemPrompt } from "../systemPrompt.js";
import { llama3call } from "../models/llama3call.js";
import { openaiCall } from "../models/openaiCall.js";
export const chat = express.Router();
chat.post("/llama3", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // chat.post("/:model",async (req:Request,res:Response)=>{ 
    // const models={
    //   llama3:llama3call,
    //   openai:openaiCall
    // }
    // const model=req.params
    // function llmCall(model:typeof models,messages){
    //   models[model](messages)
    // }
    const { messages } = req.body;
    messages.unshift(systemPrompt);
    //TODO: sanitize messages
    try {
        const LLMresponse = yield llama3call(messages);
        res.json({
            ok: true,
            content: LLMresponse.content
        });
    }
    catch (e) {
        res.json({
            ok: false,
            content: "Sorry, I don't know how to answer that",
            message: `error: ${e}`
        });
    }
}));
chat.post("/openai", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { messages } = req.body;
    messages.unshift(systemPrompt);
    //TODO: sanitize messages
    try {
        const LLMresponse = yield openaiCall(messages);
        res.json({
            ok: true,
            content: LLMresponse.content
        });
    }
    catch (e) {
        res.json({
            ok: false,
            content: "Sorry, I don't know how to answer that",
            message: `error: ${e}`
        });
    }
}));
