// src/lib/services/chatbotService.ts
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { doc, getDoc } from 'firebase/firestore';
import { getFirebaseAuth, getFirebaseFirestore } from '../../config/firebase';
import { interpret } from 'xstate';
import { chatbotMachine } from './chatbotMachine';

// Maximum number of retries before stopping
const MAX_RETRIES = 3;

// API base URL
const API_BASE_URL = 'http://10.0.2.2:3000'; // Adjust if needed

// Set up a service for the chatbot state machine
const chatbotService = interpret(chatbotMachine).start();

// Utility to handle errors consistently
const handleError = (error: unknown, message: string): never => {
  const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
  console.error(message, errorMessage);
  throw new Error(errorMessage);
};

// Fetch additional user info from Firestore
const getUserDetails = async (): Promise<any | null> => {
  try {
    const auth = getFirebaseAuth();
    const user = auth.currentUser;
    if (!user) throw new Error('No authenticated user found.');

    const firestore = getFirebaseFirestore();
    const userDocRef = doc(firestore, 'users', user.email!);
    const userDocSnapshot = await getDoc(userDocRef);

    if (!userDocSnapshot.exists()) throw new Error('User document does not exist in Firestore.');

    return userDocSnapshot.data();
  } catch (error) {
    handleError(error, 'Failed to retrieve user details from Firestore');
    return null;  // Explicitly return null to satisfy return type
  }
};

// Store and load flow state to/from SecureStore
export const storeFlowState = async (flowState: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync('flowState', flowState);
  } catch (error) {
    handleError(error, 'Failed to store flow state');
  }
};

export const loadFlowState = async (): Promise<string | null> => {
  try {
    const flowState = await SecureStore.getItemAsync('flowState');
    return flowState ?? null;
  } catch (error) {
    handleError(error, 'Failed to load flow state');
    return null;  // Explicit return for cases where loading fails
  }
};

// Reset flow state both locally and via API
export const resetFlowState = async (conversationId: string): Promise<void> => {
  try {
    const payload = { data: { conversationId } };
    console.log('Sending reset flow state request with payload:', payload);

    await SecureStore.deleteItemAsync('flowState');

    const response = await axios.post(
      `${API_BASE_URL}/resetState`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Flow state reset response:', response.data);
  } catch (error) {
    handleError(error, 'Failed to reset flow state');
  }
};





export const fetchAnswerFromAPI = async (
  conversationId: string,
  prompt: string | object,
  flowState: string | null = null
): Promise<{ response: string; suggestions: string[]; flowState?: string }> => {
  try {
    const userDetails = await getUserDetails();
    if (!userDetails) throw new Error('Failed to retrieve user details');

    flowState = flowState || (await loadFlowState()) || 'awaiting_welcome';

    const formattedPrompt = typeof prompt === 'string' ? prompt : JSON.stringify(prompt);

    const payload = {
      data: {
        conversationId,
        prompt: formattedPrompt, // Ensure prompt is a string
        flowState,
        config: { temperature: 0.7 },
        userDetails,
      },
    };

    console.log('Sending request to Genkit API with payload:', payload);

    const response = await axios.post(
      `${API_BASE_URL}/profileSetupFlow`,
      payload,
      { headers: { 'Content-Type': 'application/json' } }
    );

    if (response.status !== 200) {
      return handleError(response.data, 'Error from Genkit API');
    }

    const responseData = response.data?.result;
    console.log('Genkit API response:', responseData);

    if (responseData?.flowState) await storeFlowState(responseData.flowState);

    return {
      response: responseData?.response || 'No response generated.',
      suggestions: responseData?.suggestions || [],
      flowState: responseData?.flowState || flowState,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      await resetFlowState(conversationId);
      throw new Error(error.response?.data?.message || 'Server Error: Unable to process the request.');
    }
    return handleError(error, 'An unexpected error occurred.');
  }
};



// Function to send a message and transition to the next state
export const sendMessageAndTransition = async (
  conversationId: string,
  prompt: string
): Promise<{ response: string; suggestions: string[]; flowState?: string }> => {
  try {
    const flowState = await loadFlowState();
    const response = await fetchAnswerFromAPI(conversationId, prompt, flowState);

    chatbotService.send({ type: 'NEXT' });
    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    chatbotService.send({ type: 'ERROR', error: errorMessage });
    throw error;
  }
};

// Retry logic with limit
export const handleRetryWithLimit = async (
  conversationId: string,
  prompt: string
): Promise<{ response: string; suggestions: string[]; flowState?: string }> => {
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      return await sendMessageAndTransition(conversationId, prompt);
    } catch (error) {
      retries++;
      console.warn(`Retry attempt ${retries} failed.`);
      if (retries >= MAX_RETRIES) {
        chatbotService.send({ type: 'ERROR', error: 'Too many retries' });
        throw new Error('Too many retries. Please try again later.');
      }
    }
  }

  throw new Error('Failed after maximum retry attempts.');
};
