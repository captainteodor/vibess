// src/schemas/AgentInput.ts (assuming a centralized schema location)
import { z } from 'zod';
import { PartSchema } from '@genkit-ai/ai/model'; // Adjust as needed for the correct PartSchema import
import { normalizeGoalInput } from '../utils/utils'; // Ensure this import is correct for your setup

export const AgentInput = z.object({
    conversationId: z.string(),
    prompt: z.union([z.string(), PartSchema, z.array(PartSchema)]).optional(),
    config: z.record(z.string(), z.any()).optional(),
    userDetails: z.object({
      firstName: z.string().optional(),
      age: z.number().optional(),
      sex: z.string().optional(),
      goal: z.string().optional(),
    }).optional(),
    style: z.string().optional(),
    flowState: z.string().optional(),
  }).refine((data) => {
    // Normalize goal input here if needed
    if (data.userDetails?.goal) {
      data.userDetails.goal = normalizeGoalInput(data.userDetails.goal);
    }
    return true;
  });
  
