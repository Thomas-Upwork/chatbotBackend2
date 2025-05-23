var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import OpenAI from "openai";
import 'dotenv/config';
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY // This is the default and can be omitted
});
export function openaiCall(messages) {
    return __awaiter(this, void 0, void 0, function* () {
        const completion = yield openai.chat.completions.create({
            messages,
            model: "gpt-4.1",
            store: true,
        });
        // console.log(completion.choices[0]);
        const LLMresponse = completion.choices[0].message;
        console.log(LLMresponse);
        return LLMresponse;
    });
}
