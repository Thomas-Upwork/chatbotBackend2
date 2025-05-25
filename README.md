# Founder Training Engine

A conversational AI interface built with React (frontend) and Express (backend) using TypeScript.

## Installation
1. Clone the repository
2. Run `npm install` in both `/chatbotfrontend` and `/chatbotbackend2` directories
3. Configure environment variables (see `.env copy`)

## Building
-  Run `npm run build` in both `/chatbotfrontend` and `/chatbotbackend2` directories
  
## Usage
- Run `npm run dev` in both `/chatbotfrontend` and `/chatbotbackend2` directories.
- After building you can run the transpiled code running `npm run start` in `/chatbotbackend2` and `npm run preview` in `chatbotfrontend` directories.
- I used bun.js in the frontend just to speed up the development but it is completely compatible with npm because it is just a React app without major dependencies.

## API documentation

POST /api/chat/openai
Input:
~~~
const messages = [
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
      'and saturn?',
  },
];
~~~
Output:
~~~
  {
    role: 'assitant',
    content:
      '2.5 times earths gravity',
  },
~~~

## Scaling recomendations
Priority: high.

Connection to a database will be usefull to:
- Store logs (to detect failures or abuses). 5 hours of development at most.
- Store allowed users and passwords (security). 1 day of development at most.
- Store conversations (user experience). 1 day to set the storing and 2 days to confifure the frontend.


Vercel has can detect and store some logs, but he won't detect user manipulation. A noSQL database fits better to store conversations, the free tier from mongoDB is generous enough for most personal or internal use cases.

Priority: low.

Streaming messages

Having streaming messages enhances the user experience because he doesn't need to wait for the full answer, he can start reading as soon as the assistant replies and can cancel the conversation anytime. This is specially useful for long answers.

This will likely require 1 or 2 days of development. I have seen some production chatbots that doesn't stream their messages so I don't consider it to have higher priority.






## Warnings log
25/05/2025
The console will show a deprecation warning like this:

~~~
(node:4780) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
~~~

Using the recomended console line we find the origing of this message

~~~
node --trace-deprecation dist/main
   at node:punycode:3:9
    at Object.<anonymous> (D:\upwork\chatbot\chatbotBackend2\node_modules\whatwg-url\lib\url-state-machine.js:2:18)
~~~

This module is required by this dependency

~~~
\chatbot\chatbotBackend2>npm ls whatwg-url
server@1.0.0 \chatbot\chatbotBackend2
└─┬ openai@4.103.0
  └─┬ node-fetch@2.7.0
    └── whatwg-url@5.0.0
~~~

This warning is harmless and can be ignored, we should let opeinAI handle it by themselves. On our side we must update our openAI dependency periodically to implement their solution as soon as it is available.
