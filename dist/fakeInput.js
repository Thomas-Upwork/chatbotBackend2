// ChatCompletionRole = 'system' | 'user' | 'assistant' | 'tool' | 'function';
export const messages = [
    {
        role: 'system',
        content: "You are an AI assistan, but you give only short answers",
    },
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
        content: 'Based on your previosu answer, what would be the wheight of a 10kg mass in the moon?',
    },
];
