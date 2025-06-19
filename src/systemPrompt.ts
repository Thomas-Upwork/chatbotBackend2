// Required Node.js modules
import * as fs from 'fs';
import * as path from 'path';
import { Logger } from './helpers/Logger';

// Get current working directory
const __dirname = process.cwd();

// Join the path to your file
const filePath = path.join(__dirname, 'systemPrompt.txt');

// Read the file with error handling
let systemPromptText = '';
try {
  systemPromptText = fs.readFileSync(filePath, 'utf-8');
} catch (error) {
  Logger.error("Failed to read system prompt file", {
    filePath,
    error: error instanceof Error ? error.message : String(error)
  });
  systemPromptText = ""; // Set default empty prompt
}

// Export the system prompt object
export const systemPrompt = {
  role: 'system',
  content: systemPromptText
};