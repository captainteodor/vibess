import * as SecureStore from 'expo-secure-store';

// Define FlowState Enum
export enum FlowState {
  AWAITING_WELCOME = 'awaiting_welcome',
  AWAITING_ARCHETYPE = 'awaiting_archetype',
  COMPLETED = 'completed',
  ERROR = 'error',
}

// Define FlowStateData Interface
interface FlowStateData {
  state: FlowState;
  timestamp: number;
  retryCount: number;
}

export class ChatbotStateManager {
  private static FLOW_STATE_KEY = 'chatbot_flow_state'; // Key to store flow state in SecureStore
  private static MAX_RETRIES = 3; // Maximum retry attempts before error state

  // Valid flow state transitions
  private static validTransitions: Record<FlowState, FlowState[]> = {
    [FlowState.AWAITING_WELCOME]: [FlowState.AWAITING_ARCHETYPE, FlowState.ERROR],
    [FlowState.AWAITING_ARCHETYPE]: [FlowState.COMPLETED, FlowState.ERROR],
    [FlowState.COMPLETED]: [FlowState.AWAITING_WELCOME],
    [FlowState.ERROR]: [FlowState.AWAITING_WELCOME],
  };

  // Initializes flow state to AWAITING_WELCOME
  static async initialize(): Promise<FlowState> {
    const initialState: FlowStateData = {
      state: FlowState.AWAITING_WELCOME,
      timestamp: Date.now(),
      retryCount: 0,
    };
    await this.storeFlowState(initialState); // Store the initial state
    return initialState.state;
  }

  // Retrieves the flow state from SecureStore
  static async getFlowState(): Promise<FlowStateData> {
    try {
      const storedState = await SecureStore.getItemAsync(this.FLOW_STATE_KEY);
      if (!storedState) {
        return this.initialize().then((state) => ({
          state,
          timestamp: Date.now(),
          retryCount: 0,
        }));
      }

      const parsedState: FlowStateData = JSON.parse(storedState);
      return parsedState;
    } catch (error) {
      console.error('Error loading flow state:', error);
      return this.initialize().then((state) => ({
        state,
        timestamp: Date.now(),
        retryCount: 0,
      }));
    }
  }

  // Stores the current flow state in SecureStore
  static async storeFlowState(stateData: FlowStateData): Promise<void> {
    try {
      console.log('Storing flow state:', stateData);
      await SecureStore.setItemAsync(this.FLOW_STATE_KEY, JSON.stringify(stateData));
    } catch (error) {
      console.error('Error storing flow state:', error);
      throw new Error('Failed to store flow state');
    }
  }

  // Handles transitioning between flow states
  static async transition(newState: FlowState): Promise<boolean> {
    try {
      const currentStateData = await this.getFlowState(); // Get current state

      if (this.isValidTransition(currentStateData.state, newState)) {
        const newStateData: FlowStateData = {
          state: newState,
          timestamp: Date.now(),
          retryCount: currentStateData.retryCount,
        };
        await this.storeFlowState(newStateData); // Store new state
        console.log(`Successfully transitioned from ${currentStateData.state} to ${newState}`);
        return true;
      }

      console.error(`Invalid transition attempted: ${currentStateData.state} -> ${newState}`);
      return false;
    } catch (error) {
      console.error('Error during state transition:', error);
      return false;
    }
  }

  // Validates if the flow state transition is valid
  static isValidTransition(currentState: FlowState, nextState: FlowState): boolean {
    return this.validTransitions[currentState]?.includes(nextState) ?? false;
  }

  // Increments retry count and returns whether retry is allowed
  static async incrementRetry(): Promise<boolean> {
    const currentStateData = await this.getFlowState();
    if (currentStateData.retryCount >= this.MAX_RETRIES) {
      await this.transition(FlowState.ERROR); // Move to error state after max retries
      return false;
    }

    await this.storeFlowState({
      ...currentStateData,
      retryCount: currentStateData.retryCount + 1,
    });
    return true;
  }

  // Resets retry count back to 0
  static async resetRetryCount(): Promise<void> {
    const currentStateData = await this.getFlowState();
    await this.storeFlowState({
      ...currentStateData,
      retryCount: 0,
    });
  }

  // Resets the entire flow state back to AWAITING_WELCOME
  static async reset(): Promise<void> {
    await this.initialize(); // Resets the state to initial AWAITING_WELCOME state
  }
}
