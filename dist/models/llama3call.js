var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Groq from 'groq-sdk';
import 'dotenv/config';
//'system' | 'user' | 'assistant' | 'tool' | 'function'
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
export function llama3call(messages) {
    return __awaiter(this, void 0, void 0, function* () {
        const completion = yield groq.chat.completions.create({
            model: 'llama3-70b-8192',
            messages,
        });
        const LLMresponse = completion.choices[0].message;
        return LLMresponse;
    });
}
