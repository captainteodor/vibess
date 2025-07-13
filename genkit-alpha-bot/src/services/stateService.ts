// src/services/stateService.ts

// Define SecureStore interface to match the expected API
let SecureStore: {
  setItemAsync: (key: string, value: string) => Promise<void>;
  getItemAsync: (key: string) => Promise<string | null>;
  deleteItemAsync: (key: string) => Promise<void>;
};

const inMemoryStore: Record<string, string> = {};

// Helper function to define a mock storage for Node.js environments
const createMockSecureStore = () => ({
  async setItemAsync(key: string, value: string) {
    inMemoryStore[key] = value;
    console.log(`[Mock SecureStore] Set item: ${key} = ${value} | Store now:`, JSON.stringify(inMemoryStore));
  },
  async getItemAsync(key: string) {
    const value = inMemoryStore[key];
    console.log(`[Mock SecureStore] Get item for key: ${key}, found: ${value} | Store:`, JSON.stringify(inMemoryStore));
    return value || null;
  },
  async deleteItemAsync(key: string) {
    console.log(`[Mock SecureStore] Delete item for key: ${key}`);
    delete inMemoryStore[key];
  },
});

// Environment detection logic
const isReactNative = typeof window !== 'undefined' && typeof navigator !== 'undefined' && navigator.product === 'ReactNative';

// SecureStore initialization based on the environment
if (isReactNative) {
  try {
    SecureStore = require('expo-secure-store');
  } catch (error) {
    console.error("Failed to load SecureStore in React Native environment:", error);
    throw new Error("SecureStore is required but not available in this environment.");
  }
} else {
  console.warn("SecureStore is not available in this environment. Using a mock storage for Node.js.");
  SecureStore = createMockSecureStore();
}

/**
 * Resets the flow state for a given conversation ID.
 * @param conversationId - The unique ID of the conversation to reset.
 */

export const resetFlowState = async (conversationId: string): Promise<void> => {
  console.log(`Starting resetFlowState for conversation ID: ${conversationId}`);
  const key = `flowState_${conversationId}`;

  // Check if the flow state exists in inMemoryStore or SecureStore
  const inMemoryState = inMemoryStore[conversationId];
  const secureStoreState = await SecureStore.getItemAsync(key);
  
  // If both are null, log and exit early
  if (!inMemoryState && !secureStoreState) {
    console.warn(`Reset blocked for ${conversationId}. No flow state found in memory or secure storage.`);
    throw new Error(`Reset blocked for ${conversationId}. Current state is 'null'.`);
  }

  // Proceed with deletion if state is found
  try {
    delete inMemoryStore[conversationId];
    await SecureStore.deleteItemAsync(key);
    console.log(`Flow state reset successfully for conversation ID: ${conversationId}`);
  } catch (error) {
    console.error(`Failed to reset flow state for ${conversationId}:`, error);
    throw new Error(`Unable to reset flow state for ${conversationId}`);
  }
};



/**
 * Sets the flow state for a given conversation ID.
 * @param conversationId - The unique ID of the conversation.
 * @param state - The flow state to set.
 */
export const setFlowState = async (conversationId: string, state: string): Promise<void> => {
  const key = `flowState_${conversationId}`;
  console.log(`Setting flow state for conversation ID: ${conversationId} to ${state}`);

  try {
    await SecureStore.setItemAsync(key, state);
    console.log(`Flow state set successfully for conversation ID: ${conversationId}`);
  } catch (error) {
    console.error(`Error setting flow state for conversation ID ${conversationId}:`, error);
    throw new Error(`Unable to set flow state for conversation ID: ${conversationId}`);
  }
};

/**
 * Retrieves the flow state for a given conversation ID.
 * @param conversationId - The unique ID of the conversation.
 * @returns The stored flow state or null if not found.
 */
export const getFlowState = async (conversationId: string): Promise<string | null> => {
  const key = `flowState_${conversationId}`;
  console.log(`Retrieving flow state for conversation ID: ${conversationId}`);

  try {
    const state = await SecureStore.getItemAsync(key);
    if (state) {
      console.log(`Flow state for conversation ID ${conversationId} is ${state}`);
    } else {
      console.warn(`No flow state found for conversation ID: ${conversationId}`);
    }
    return state;
  } catch (error) {
    console.error(`Error retrieving flow state for conversation ID ${conversationId}:`, error);
    throw new Error(`Unable to retrieve flow state for conversation ID: ${conversationId}`);
  }
};

export default SecureStore;
