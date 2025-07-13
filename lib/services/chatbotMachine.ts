// src/lib/services/chatbotMachine.ts
import { setup, assign } from 'xstate';

// Define types for context and events
interface ChatbotContext {
  error?: string;
  prompt?: string;
  response?: string;
}

type ChatbotEvent =
  | { type: 'START' }
  | { type: 'SEND_MESSAGE'; prompt: string }
  | { type: 'RETRY' }
  | { type: 'RESET' }
  | { type: 'NEXT_STATE' }
  | { type: 'ERROR'; error: string }
  | { type: 'COMPLETE' }
  | { type: 'NEXT' };

export const chatbotMachine = setup({
  types: {
    context: {} as ChatbotContext,
    events: {} as ChatbotEvent,
  },
  actions: {
    setError: assign({
      error: ({ event }) => (event.type === 'ERROR' ? event.error : undefined),
    }),
    resetError: assign({ error: () => undefined }),
  },
}).createMachine({
  id: 'chatbot',
  initial: 'awaiting_welcome',
  context: {
    error: undefined,
  },
  states: {
    awaiting_welcome: {
      on: {
        NEXT: 'awaiting_archetype',
        ERROR: {
          target: 'error',
          actions: 'setError',
        },
      },
    },
    awaiting_archetype: {
      on: {
        SEND_MESSAGE: {
          target: 'sending_message',
          actions: assign({ prompt: ({ event }) => event.prompt }),
        },
        ERROR: {
          target: 'error',
          actions: 'setError',
        },
        NEXT: 'awaiting_suggestions', // Transition to awaiting_suggestions
      },
    },
    awaiting_suggestions: {  // New state for awaiting suggestions
      on: {
        SEND_MESSAGE: {
          target: 'sending_message',
          actions: assign({ prompt: ({ event }) => event.prompt }),
        },
        ERROR: {
          target: 'error',
          actions: 'setError',
        },
        NEXT: 'awaiting_photos', // Transition to awaiting_photos after suggestions are completed
      },
    },
    awaiting_photos: {
      on: {
        SEND_MESSAGE: {
          target: 'sending_message',
          actions: assign({ prompt: ({ event }) => event.prompt }),
        },
        ERROR: {
          target: 'error',
          actions: 'setError',
        },
        COMPLETE: 'completed',
      },
    },
    sending_message: {
      on: {
        NEXT: 'awaiting_suggestions',
        ERROR: {
          target: 'error',
          actions: 'setError',
        },
      },
    },
    completed: {
      on: {
        RESET: {
          target: 'awaiting_welcome',
          actions: 'resetError',
        },
      },
    },
    error: {
      on: {
        RETRY: {
          target: 'awaiting_welcome',
          actions: 'resetError',
        },
      },
    },
  },
});
