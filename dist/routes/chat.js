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
import { openaiCall } from "../models/openaiCall.js";
export const chat = express.Router();
chat.post("/openai", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { messages } = req.body;
        // Validate messages exists and is an array
        if (!Array.isArray(messages)) {
            res.status(400).json({
                ok: false,
                message: "Invalid messages format - expected an array",
            });
            return;
        }
        // Sanitize messages
        const sanitizedMessages = [];
        for (const message of messages) {
            // Check if message is valid
            if (typeof message === 'object' &&
                message !== null &&
                typeof message.content === 'string' &&
                message.content.trim() !== "") {
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
            return;
        }
        // Add system prompt at the beginning
        const fullMessages = [systemPrompt, ...sanitizedMessages];
        const LLMresponse = yield openaiCall(fullMessages);
        res.json({
            ok: true,
            content: LLMresponse.content
        });
        return;
    }
    catch (e) {
        console.error("Error in /openai endpoint:", e);
        res.status(500).json({
            ok: false,
            content: "Sorry, I don't know how to answer that",
            message: "Error at calling API"
        });
        return;
    }
}));
