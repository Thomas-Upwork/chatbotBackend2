import express, { Request, Response } from "express";
import { systemPrompt } from "../systemPrompt.js";
import { openaiCall } from "../models/openaiCall.js";
import { ChatCompletionUserMessageParam } from "openai/resources/index.js";
import { validateToken } from "../middlewares/cookies.js";
import { Logger } from "../helpers/Logger.js";

export const chat = express.Router();

chat.post("/openai",validateToken, async (req: Request, res: Response) => {
  try {
    const { messages } = req.body;
   
    // Validate messages exists and is an array
    if (!Array.isArray(messages)) {
      res.status(400).json({
        ok: false,
        message: "Invalid messages format - expected an array",
      });
      return
    }


    // Sanitize messages
    const sanitizedMessages: ChatCompletionUserMessageParam[] = [];
   
    for (const message of messages) {
      // Check if message is valid
      if (
        typeof message === 'object' &&
        message !== null &&
        typeof message.content === 'string' &&
        message.content.trim() !== ""
      ) {
        // Only push valid messages
        sanitizedMessages.push({
          role: "user",
          content: message.content.trim()
        });
      }
      // No else needed - invalid messages are implicitly skipped
    }


    // Check if we have any valid messages left
    if (sanitizedMessages.length === 0) {
      res.status(400).json({
        ok: false,
        message: "No valid messages provided",
      });
      return
    }


    // Add system prompt at the beginning
    const fullMessages = [systemPrompt, ...sanitizedMessages];
   
    const LLMresponse = await openaiCall(fullMessages as ChatCompletionUserMessageParam[]);
   
    res.json({
      ok: true,
      content: LLMresponse.content
    });
    return
   
  } catch (e) {
    Logger.error("Error in /openai endpoint:", e);
    res.status(500).json({
      ok: false,
      content: "Sorry, I don't know how to answer that",
      message: "Error at calling API"
    });
    return
  }
});


