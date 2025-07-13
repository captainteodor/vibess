import { promptRef } from '@genkit-ai/dotprompt';
import { UserDetails } from '../data/models/UserDetails';
import { Archetype } from '../data/models/Archetype';
import { parseResponse } from '../utils/parseResponse';

// Initialize references to the dotprompts defined for archetype and welcome messages
const archetypePrompt = promptRef('archetype');
const welcomePrompt = promptRef('welcome');
const archetypeDescriptionPrompt = promptRef('photos');

/**
 * Generates an archetype suggestion based on user details and matching archetypes.
 * @param archetypes - List of best-matching archetypes.
 * @param userDetails - User details to personalize the response.
 * @returns A JSON object containing the response and a list of suggested archetypes.
 */
export const generateArchetypeSuggestion = async (
  archetypes: Archetype[],
  userDetails: UserDetails
): Promise<{ response: string; archetypes: string[] }> => {
  try {
    const archetypeNames = archetypes.map((archetype) => archetype.name).join(', ');
    const inputParams = {
      firstName: userDetails.firstName || 'Guest',
      age: userDetails.age || 25,
      sex: userDetails.sex || 'Unknown',
      goal: userDetails.goal || 'long-term',
      archetypes: archetypeNames,
      style: userDetails.style || 'friendly and humorous',
    };

    console.log("Sending prompt with inputParams:", JSON.stringify(inputParams, null, 2));

    const response = await archetypePrompt.generate({
      input: inputParams,
      config: { temperature: 0.3, maxOutputTokens: 512 },
    });

    console.log("Received raw response:", JSON.stringify(response, null, 2));

    const parsedResponse = parseResponse(response);

    if (!parsedResponse || !parsedResponse.archetypes) {
      throw new Error('No valid archetypes from archetype prompt.');
    }

    return {
      response: parsedResponse.response,
      archetypes: parsedResponse.archetypes,
    };
  } catch (error) {
    console.error('Error generating archetype suggestion:', error);
    throw new Error('Failed to generate archetype suggestion.');
  }
};

/**
 * Generates a welcome message tailored to the user's profile details.
 * @param userDetails - User details to personalize the welcome response.
 * @returns A JSON object containing the welcome message and any follow-up suggestions.
 */
export const generateWelcomeMessage = async (
  userDetails: UserDetails
): Promise<{ response: string; suggestions: string[] }> => {
  try {
    const inputParams = {
      firstName: userDetails.firstName || 'Guest',
      age: userDetails.age || 25,
      sex: userDetails.sex || 'Unknown',
      style: userDetails.style || 'friendly and humorous',
    };

    const response = await welcomePrompt.generate({
      input: inputParams,
      config: { temperature: 0.3, maxOutputTokens: 512 },
    });

    const parsedResponse = parseResponse(response);

    if (!parsedResponse || !parsedResponse.suggestions) {
      throw new Error('No valid response from welcome prompt.');
    }

    return {
      response: parsedResponse.response,
      suggestions: parsedResponse.suggestions,
    };
  } catch (error) {
    console.error('Error generating welcome message:', error);
    throw new Error('Failed to generate welcome message.');
  }
};

/**
 * Generates detailed descriptions for selected archetypes to guide the user in the profile setup flow.
 * @param selectedArchetypes - List of selected archetype names.
 * @param userDetails - User details to personalize the response.
 * @returns A JSON object containing the response with archetype descriptions.
 */
export const describeArchetypes = async (
  selectedArchetypes: string,
  userDetails: UserDetails
): Promise<{ response: string }> => {
  try {
    const inputParams = {
      firstName: userDetails.firstName || 'Guest',
      age: userDetails.age || 25,
      sex: userDetails.sex || 'Unknown',
      archetypes: selectedArchetypes, // Received as a comma-separated string
      style: userDetails.style || 'friendly and descriptive',
    };

    console.log("Sending archetype description prompt with inputParams:", JSON.stringify(inputParams, null, 2));

    const response = await archetypeDescriptionPrompt.generate({
      input: inputParams,
      config: { temperature: 0.3, maxOutputTokens: 512 },
    });

    console.log("Received raw description response:", JSON.stringify(response, null, 2));

    const parsedResponse = parseResponse(response);

    if (!parsedResponse || !parsedResponse.response) {
      throw new Error('Failed to generate archetype descriptions.');
    }

    return { response: parsedResponse.response };
  } catch (error) {
    console.error('Error generating archetype descriptions:', error);
    throw new Error('Failed to generate archetype descriptions.');
  }
};

