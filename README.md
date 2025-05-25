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

## Features

### Frontend
To handle both routes it is being used react router.

For the styles is it being used Tailwind and a little css.

It doesn't have any extra dependencies than the preinstalled with the template from vite+react+typescript.



#### Login
- The login route  has an input field to introduce the password.
- There is a button to hide/show the passwords - what enhances the user experience a lot, we don't realize how usesfull it is until the moment we don't have it.
- The user can click enter after he writes the password if he prefers it instead of clicking the button.
- The button changes its appearance on hover and on click.
- If the frontend doesn't receives a response from the backend in 15 secconds it shows a message to the user.

#### Chat
- The phrases from the user and assistant are colorized differently to avoid confusions.
- The send button is disabled when there is not message in the input field.
- The send button changes its appearance on hover and on click.
- The send button also can handle abortions if it is clicked again.
- If the fronetnd doesn't receives a response from the server in 20 seconds it will trigger an abortion.
- The input field wont be cleared after abortions or bad responses from the server.
- The user can click enter after he writes the message if he prefers it instead of clicking the button.
- There is a logout that will automatically send you to the login, your cookie also will be deleted so you can't go back unless you introduce your password again.
- The div scrolls automatically to the bottom after sending a message.
- If there is an error, it will be shown in the chat with a red color.


## API documentation

POST `/api/chat/openai`
This route is protected, it needs a valid cookie to be accessed.
I also has a lax rate limit 20 requests per minute
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

GET `/api/login`
validates the password, creates a jsonwebtoken and sets a cookie in the browser.
This route has a stricter rate limit 20 requests in 15 minutes.
The cookies has a live of 48 hours. After the password would be required to create a new one.

GET `/api/login/logout`
resents the password set from login

GET `/chat`
serves the chat page from `/public/index.html`.
this

GET `/login`
serves the login page from `/public/index.html`.

## Scaling recomendations
### Connection to a database will be usefull to:
Priority: high.

- Store logs (to detect failures or abuses). 5 hours of development at most.
- Store allowed users and passwords (security, it allows to delete and add valid users, change paswords etc). 1 day of development at most.
- Store conversations (user experience). 1 day to set the storing and 2 days to configure the frontend.


Vercel can detect and store some logs, but they may not be useful to detect the reason why the server colapses or something. A noSQL database fits better to store conversations, the free tier from mongoDB is generous enough for most personal or internal use cases.

### Streaming messages
Priority: low.

Having streaming messages enhances the user experience because he doesn't need to wait for the full answer, he can start reading as soon as the assistant replies and can cancel the conversation anytime. This is specially useful for long answers.

This will likely require 1 or 2 days of development. I have seen some production chatbots that doesn't stream their messages so I don't consider it to have higher priority.

### Control panel
Priority: low.

It would be used to manage the users, delete old ones and change their permissions etc. This could be done also from the database, the control panel just makes it easier and quicker. This will require 1 day of developmen.


## Warning log
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
