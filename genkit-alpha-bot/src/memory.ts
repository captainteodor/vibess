import { MessageData } from '@genkit-ai/ai/model';

const chatHistory: Record<string, MessageData[]> = {};

export interface HistoryStore {
  load(id: string): Promise<MessageData[] | undefined>;
  save(id: string, history: MessageData[]): Promise<void>;
  remove(id: string): Promise<void>;  // New method for resetting history
}

export function inMemoryStore(): HistoryStore {
  return {
    async load(id: string): Promise<MessageData[] | undefined> {
      return chatHistory[id];
    },
    async save(id: string, history: MessageData[]) {
      chatHistory[id] = history;
    },
    async remove(id: string): Promise<void> { // Implement reset functionality
      delete chatHistory[id];
      console.log(`Flow state for conversation ID: ${id} has been reset.`);
    }
  };
}
