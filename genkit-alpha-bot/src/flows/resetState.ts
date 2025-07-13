// src/flows/resetState.ts

import { defineFlow } from '@genkit-ai/flow';
import { z } from 'zod';
import { resetFlowState, getFlowState, setFlowState } from '../services/stateService';

// Utility to add a timeout to an async operation
const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
  const timeout = new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Operation timed out')), ms));
  return Promise.race([promise, timeout]);
};

const ResetStateInput = z.object({ conversationId: z.string() });
const ResetStateOutput = z.object({ message: z.string() });

export const resetState = defineFlow(
  {
    name: 'resetState',
    inputSchema: ResetStateInput,
    outputSchema: ResetStateOutput,
  },
  async (request) => {
    const { conversationId } = request;
    console.log(`[ResetState] Initiated for conversation ID: ${conversationId}`);

    try {
      // Step 1: Check current state
      const existingState = await withTimeout(getFlowState(conversationId), 3000);
      console.log(`[ResetState] Current state for ${conversationId}: ${existingState}`);

      // Handle null state scenario
      if (existingState === null) {
        console.warn(`[ResetState] No existing state found for conversation ID: ${conversationId}. Nothing to reset.`);
        return { message: `No flow state found for ${conversationId}. Reset not required.` };
      }

      // Main reset logic
      if (existingState !== 'awaiting_reset' && existingState !== 'awaiting_archetype') {
        console.warn(`[ResetState] Reset blocked. Found state '${existingState}', expected 'awaiting_reset' or 'awaiting_archetype'`);
        return { message: `Reset blocked for ${conversationId}. Current state is '${existingState}'.` };
      }

      // Step 2: Perform reset
      await withTimeout(resetFlowState(conversationId), 3000);
      console.log(`[ResetState] Flow state reset for conversation ID: ${conversationId}`);

      // Step 3: Set and verify the final state
      await withTimeout(setFlowState(conversationId, 'reset_complete'), 3000);
      const finalState = await withTimeout(getFlowState(conversationId), 3000);
      console.log(`[ResetState] Verified final state for ${conversationId}: ${finalState}`);

      if (finalState !== 'reset_complete') {
        console.error(`[ResetState] Final state mismatch. Expected 'reset_complete' but found '${finalState}'`);
        return { message: `State verification failed for ${conversationId}.` };
      }

      return { message: `Flow state successfully reset and verified as 'reset_complete' for ${conversationId}.` };

    } catch (error) {
      console.error(`[ResetState] Error for ${conversationId}:`, error);
      return { message: `Reset failed for ${conversationId}: ${error instanceof Error ? error.message : 'unknown error'}` };
    }
  }
);
