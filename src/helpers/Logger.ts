import Log from '../db/loggerSchema'


// const currentDate=new Date()
export class Logger {
  private static async basicLog(level: 'warning' | 'error' | 'info', message: string, data:unknown ="") {
    try {
      // console.log(`[${level}]${currentDate.toISOString()}${message}${data}`)
      await Log.create({
        priority: level.toLowerCase(),
        description: message,
        comments: JSON.stringify(data),
      });
    } catch (err) {
      console.error('Failed to write log:', err);
    }
  }

  static warn(message: string, data:unknown ="") {
    // console.warn(`[${currentDate.toISOString()}${message}${data}`)
    this.basicLog('warning', message, data);
  }

  static info(message: string, data:unknown ="") {
    // console.info(`[${currentDate.toISOString()}${message}${data}`)
    this.basicLog('info', message, data);
  }

  static error(message: string, data:unknown ="") {
    // console.error(`[${currentDate.toISOString()}${message}${data}`)
    this.basicLog('error', message, data);
  }
}
