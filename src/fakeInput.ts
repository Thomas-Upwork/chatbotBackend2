// import { ChatCompletionSystemMessageParam } from 'groq-sdk/resources/chat/completions';
// ChatCompletionRole = 'system' | 'user' | 'assistant' | 'tool' | 'function';

export const messages = [
  {
    role: 'user',
    content: "what't the gravity in the moon?",
  },
  {
    role: 'assistant',
    content: '1/6 the gravity of earth',
  },
  {
    role: 'user',
    content:
      'Based on your previosu answer, what would be the wheight of a 10kg mass in the moon?',
  },
];
