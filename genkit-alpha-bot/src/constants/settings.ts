// constants/settings.ts
import { config } from 'dotenv';
config();

// Load and parse environment variables
export const MODEL_TEMPERATURE = parseFloat(process.env.MODEL_TEMPERATURE || '0.6');
export const CACHE_DURATION = parseInt(process.env.CACHE_DURATION || '60000', 10); // 60 seconds default
export const FIREBASE_LOCATION = process.env.FIREBASE_LOCATION || 'europe-west4';

// Export any other global settings that might be used across the application
export const LOG_LEVEL = process.env.LOG_LEVEL || 'debug';
export const ENABLE_TRACING = process.env.ENABLE_TRACING === 'true';
