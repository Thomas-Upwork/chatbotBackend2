
import express from "express";
import 'dotenv/config'
import cookieParser from 'cookie-parser';

import { chat } from "./routes/chat.js";
import { closeDBConnection, dbConnection } from "./db/connection.js";
import { CronService } from "./CronService.js"
import { limiter, strictLimiter } from "./middlewares/rateLimit.js";
import { login } from "./routes/login.js";
import { pages } from "./routes/pages.js";
import { userInfo } from "./routes/userInfo.js";

const app=express();
const PORT=process.env.PORT??4200;

// Initialize cron jobs
const cronService = new CronService();
cronService.initCronJobs();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use('/api/login',strictLimiter,login)
app.use('/api/userinfo',limiter,userInfo)
app.use('/api/chat',limiter,chat)
app.use('/',limiter,pages)

//This endpoint is to test the abortion from the client
// app.post('/api/abort',()=>{
//   console.log('abort endpoint hit')
// })



async function startServer() {
  try {
    // Connect to MongoDB first
    await dbConnection();
    
    // Then start the Express server
    const server= app.listen(PORT,(err)=>{
      if (err) {
        console.log(err);
      } else {
        console.log(`Server started on http://localhost:${PORT}`);
      }
    });
    // Handle graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('SIGTERM received. Shutting down gracefully...');
      server.close(async () => {
        await closeDBConnection();
        console.log('Server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', async () => {
      console.log('SIGINT received. Shutting down gracefully...');
      server.close(async () => {
        await closeDBConnection();
        console.log('Server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();