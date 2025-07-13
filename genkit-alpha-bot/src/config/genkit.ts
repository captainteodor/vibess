// src/config/genkit.ts
import { configureGenkit } from '@genkit-ai/core';
import { firebase } from '@genkit-ai/firebase';
import { vertexAI } from '@genkit-ai/vertexai';
import { dotprompt } from '@genkit-ai/dotprompt';
import { config } from 'dotenv';
import { MODEL_TEMPERATURE, FIREBASE_LOCATION } from '../constants/settings';

// Load environment variables
config();

export default configureGenkit({
  plugins: [
    firebase(), // Firebase Plugin
    dotprompt(), // Dotprompt Plugin
    vertexAI({
      location: FIREBASE_LOCATION,
    }),
  ],
  traceStore: 'firebase',
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});

console.log("Loading Genkit configuration");
console.log("Firebase Location:", FIREBASE_LOCATION);
console.log("Model Temperature:", MODEL_TEMPERATURE);
