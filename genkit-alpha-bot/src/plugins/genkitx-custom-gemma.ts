import { genkitPlugin, GenkitError } from '@genkit-ai/core';
import { 
  defineModel, 
  modelRef, 
  type GenerateRequest,
  type GenerateResponseData
} from '@genkit-ai/ai/model';
import { simulateSystemPrompt } from '@genkit-ai/ai/model/middleware';
import { GoogleAuth } from 'google-auth-library';
import axios, { AxiosError } from 'axios';
import { z } from 'zod';

// Plugin configuration interface
interface GemmaPluginOptions {
  projectId?: string;
  location?: string;
  endpointId?: string;
}

// Model-specific configuration schema
const GemmaConfigSchema = z.object({
  version: z.string().optional(),
  temperature: z.number().min(0).max(1).optional(),
  maxOutputTokens: z.number().min(1).max(2048).optional(),
  topP: z.number().min(0).max(1).optional(),
  topK: z.number().min(1).optional(),
  stopSequences: z.array(z.string()).optional()
});

export const gemmaModelRef = modelRef({
  name: 'vertex-gemma/gemma-2',
  configSchema: GemmaConfigSchema,
  info: {
    label: 'Gemma 2 on Vertex AI',
    versions: ['gemma-2']
  }
} as const);

const getAccessToken = async (): Promise<string> => {
  try {
    const auth = new GoogleAuth({ 
      scopes: 'https://www.googleapis.com/auth/cloud-platform' 
    });
    const client = await auth.getClient();
    const accessToken = (await client.getAccessToken()).token;
    if (!accessToken) throw new Error('Failed to obtain access token.');
    return accessToken;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to obtain access token: ${message}`);
  }
};

function extractTextFromContent(content: any[]): string {
  return content
    .map(item => {
      if (typeof item === 'string') return item;
      if (item && typeof item === 'object') {
        if ('text' in item) return item.text;
        if ('data' in item) return String(item.data);
      }
      return '';
    })
    .join('');
}

function formatRoleTag(role: string, content: string): string {
  switch (role) {
    case 'system':
      return `<system>${content}</system>`;
    case 'user':
      return `<user>${content}</user>`;
    case 'model':
    case 'assistant':
      return `<assistant>${content}</assistant>`;
    default:
      return content;
  }
}

export const vertexGemmaPlugin = genkitPlugin(
  'vertex-gemma',
  async (options: GemmaPluginOptions) => {
    const projectId = options.projectId || process.env.GOOGLE_CLOUD_PROJECT;
    const location = options.location || process.env.VERTEX_LOCATION || 'us-central1';
    const endpointId = options.endpointId || process.env.VERTEX_GEMMA_ENDPOINT;

    if (!projectId) {
      throw new GenkitError({
        source: 'vertex-gemma',
        status: 'INVALID_ARGUMENT',
        message: 'Must supply either `options.projectId` or set `GOOGLE_CLOUD_PROJECT` environment variable.'
      });
    }

    if (!endpointId) {
      throw new GenkitError({
        source: 'vertex-gemma',
        status: 'INVALID_ARGUMENT',
        message: 'Must supply either `options.endpointId` or set `VERTEX_GEMMA_ENDPOINT` environment variable.'
      });
    }

    defineModel({
      name: gemmaModelRef.name,
      label: gemmaModelRef.info?.label ?? 'Gemma 2 on Vertex AI',
      versions: gemmaModelRef.info?.versions ?? ['gemma-2'],
      supports: {
        multiturn: true,
        systemRole: true,
        tools: false,
        media: false,
        output: ['text']
      },
      configSchema: GemmaConfigSchema,
      use: [simulateSystemPrompt()],
    }, async (request: GenerateRequest<typeof GemmaConfigSchema>): Promise<GenerateResponseData> => {
      try {
        const token = await getAccessToken();

        const formattedPrompt = request.messages
          .map(message => {
            const textContent = extractTextFromContent(message.content);
            return formatRoleTag(message.role, textContent);
          })
          .join('\n');

        // Updated request body format
        const requestBody = {
          instances: [
            {
              inputs: formattedPrompt  // Changed from 'text' to 'inputs'
            }
          ],
          parameters: {
            temperature: request.config?.temperature ?? 0.7,
            maxOutputTokens: request.config?.maxOutputTokens ?? 1024,
            topP: request.config?.topP ?? 0.95,
            topK: request.config?.topK ?? 32
          }
        };

        console.log('Sending request to Vertex AI:', {
          url: `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/endpoints/${endpointId}:predict`,
          body: JSON.stringify(requestBody, null, 2)
        });

        const response = await axios.post(
          `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/endpoints/${endpointId}:predict`,
          requestBody,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        console.log('Vertex AI Response:', JSON.stringify(response.data, null, 2));

        // Handle potential different response formats
        const outputText = response.data.predictions?.[0]?.outputs ?? 
                         response.data.predictions?.[0]?.text ??
                         response.data.predictions?.[0];

        if (!outputText) {
          throw new Error('Invalid response format from Vertex AI');
        }

        return {
          candidates: [{
            index: 0,
            message: {
              role: 'model',
              content: [{
                text: outputText
              }]
            },
            finishReason: 'stop'
          }],
          usage: {
            inputTokens: 0,
            outputTokens: 0,
            totalTokens: 0
          }
        };
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Vertex AI Error Details:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message,
            config: {
              url: error.config?.url,
              method: error.config?.method,
              headers: error.config?.headers,
              data: error.config?.data,
            }
          });

          throw new GenkitError({
            source: 'vertex-gemma',
            status: 'FAILED_PRECONDITION',
            message: `API request failed: ${error.response?.data?.error?.message || error.message}`,
            detail: error.response?.data
          });
        }

        console.error('Unexpected error:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        throw new GenkitError({
          source: 'vertex-gemma',
          status: 'FAILED_PRECONDITION',
          message: `Generation failed: ${message}`,
          detail: error
        });
      }
    });
  }
);