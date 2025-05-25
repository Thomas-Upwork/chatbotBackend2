// Required Node.js modules
import * as fs from 'fs';
import * as path from 'path';

// Get current working directory
const __dirname = process.cwd();


// Join the path to your file
const filePath = path.join(__dirname, 'systemPrompt.txt');


// Read the file synchronously with UTF-8 encoding to support special symbols
const systemPromptText = fs.readFileSync(filePath, 'utf-8');


// Export the system prompt object
export const systemPrompt = {
  role: 'system',
  content: systemPromptText
};


