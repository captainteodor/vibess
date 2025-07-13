// /genkit-alpha-bot/src/flows/profileSetupFlow.ts

import { defineFlow } from '@genkit-ai/flow';
import { z } from 'zod';
import { FlowState } from '../constants/flowState';
import { fetchArchetypes } from '../data/repositories/archetypeRepository';
import { generateWelcomeMessage, generateArchetypeSuggestion } from '../services/promptService';
import { setFlowState } from '../services/stateService';
import { ensureString, normalizeGoalInput } from '../utils';
import { UserDetails } from '../data/models/UserDetails';
import { Archetype } from '../data/models/Archetype';

const AgentInput = z.object({
  conversationId: z.string(),
  prompt: z.union([z.string(), z.array(z.string())]).optional(),
  config: z.record(z.string(), z.any()).optional(),
  userDetails: z.object({
    firstName: z.string().optional(),
    age: z.number().optional(),
    sex: z.string().optional(),
    goal: z.string().optional(),
  }).optional(),
  style: z.string().optional(),
  flowState: z.string().optional(),
});

const AgentOutput = z.object({
  response: z.string(),
  suggestions: z.array(z.string()).optional(),
  flowState: z.string(),
});

const getDefaultUserDetails = (overrides: Partial<UserDetails> = {}): UserDetails => ({
  firstName: overrides.firstName || 'Guest',
  age: overrides.age || 25,
  sex: overrides.sex || 'Unknown',
  goal: overrides.goal || '',
  style: overrides.style || 'friendly',
});

export const profileSetupFlow = defineFlow(
  {
    name: 'profileSetupFlow',
    inputSchema: AgentInput,
    outputSchema: AgentOutput,
  },
  async (request) => {
    const { conversationId } = request;
    let flowState = request.flowState || FlowState.AWAITING_WELCOME;

    console.log(`[ProfileSetupFlow] Initial flow state: ${flowState} for conversation ID: ${conversationId}`);

    if (flowState === FlowState.ERROR) {
      flowState = FlowState.AWAITING_WELCOME;
      await setFlowState(conversationId, flowState);
    }

    if (flowState === FlowState.AWAITING_WELCOME) {
      try {
        const userDetails = getDefaultUserDetails(request.userDetails || {});
        
        console.log(`[ProfileSetupFlow] Generating welcome prompt for ${userDetails.firstName}`);
        
        const { response, suggestions } = await generateWelcomeMessage(userDetails);

        flowState = FlowState.AWAITING_ARCHETYPE;
        await setFlowState(conversationId, flowState);

        return { 
          flowState, 
          response, 
          suggestions: suggestions || ['Long-term relationship', 'Short-term relationship'] 
        };
      } catch (error) {
        console.error('Error generating welcome prompt:', error);
        flowState = FlowState.ERROR;
        await setFlowState(conversationId, flowState);
        return { flowState, response: 'Error generating welcome prompt.', suggestions: [] };
      }
    }

    if (flowState === FlowState.AWAITING_ARCHETYPE) {
      let userGoal = request.userDetails?.goal || ensureString(request.prompt);
      if (!userGoal) {
        flowState = FlowState.ERROR;
        return { flowState, response: 'Error: No relationship goal provided.', suggestions: [] };
      }

      userGoal = normalizeGoalInput(userGoal);

      try {
        const archetypes = await fetchArchetypes();
        const userDetails = getDefaultUserDetails(request.userDetails || {});
        
        const { response, archetypes: suggestedArchetypes } = await generateArchetypeSuggestion(
          archetypes.filter((a: Archetype) => a.relationshipGoals[userGoal]),
          { ...userDetails, goal: userGoal }
        );

        flowState = FlowState.AWAITING_PHOTOS;
        await setFlowState(conversationId, flowState);

        return { flowState, response, suggestions: suggestedArchetypes };
      } catch (error) {
        console.error('Error generating archetype suggestions:', error);
        flowState = FlowState.ERROR;
        return { flowState, response: 'Failed to generate archetype suggestions.', suggestions: [] };
      }
    }

    return { flowState: FlowState.ERROR, response: 'Unexpected error in profile setup flow.', suggestions: [] };
  }
);
