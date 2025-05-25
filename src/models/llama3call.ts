// import Groq from 'groq-sdk';
// import 'dotenv/config';
// import { ChatCompletionSystemMessageParam } from 'groq-sdk/resources/chat/completions';
// //'system' | 'user' | 'assistant' | 'tool' | 'function'

// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// export async function llama3call(messages: ChatCompletionSystemMessageParam[]) {
//   const completion = await groq.chat.completions.create({
//     model: 'llama3-70b-8192',
//     messages,

//   });
//   const LLMresponse = completion.choices[0].message;
//   return LLMresponse;
// }
