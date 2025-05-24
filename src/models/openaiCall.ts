import OpenAI from "openai";
import 'dotenv/config';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // This is the default and can be omitted
});

export async function openaiCall(messages:OpenAI.Chat.Completions.ChatCompletionMessageParam[]) {
  const completion = await openai.chat.completions.create({
    messages,
    // model: "gpt-4.1",
    model: "o4-mini",
    store: true,
  });

  // console.log(completion.choices[0]);
  const LLMresponse=completion.choices[0].message
  // console.log(LLMresponse);
  return LLMresponse;

}