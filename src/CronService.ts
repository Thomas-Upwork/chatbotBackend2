// src/services/cron.service.ts
import cron from 'node-cron';
import Log from './db/loggerSchema';
import { Logger } from './helpers/Logger';

export class CronService {
  initCronJobs() {
    // Run on the first day of every month at 2 AM
    cron.schedule('0 2 1 * *', async () => {
      try {
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
        
        const result = await Log.deleteMany({
          createdAt: { $lt: ninetyDaysAgo }
        });
        
        Logger.info(`Deleted ${result.deletedCount} logs older than 90 days`);
      } catch (error) {
        Logger.error('Failed to clean up old logs:', error);
      }
    });
  }
}