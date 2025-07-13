import { GoogleAuth } from 'google-auth-library';
import { config } from 'dotenv';

// Load environment variables
config();

// Create a GoogleAuth instance
const auth = new GoogleAuth({
  scopes: ['https://www.googleapis.com/auth/cloud-platform'], // Scope for accessing Google Cloud services
});

/**
 * Retrieves an access token for authenticating API requests to Google Cloud services.
 * Uses Application Default Credentials (ADC) which can be set up locally via `gcloud auth application-default login`
 * or through service account credentials in other environments.
 *
 * @returns {Promise<string>} A promise that resolves to the access token.
 */
export const getAccessToken = async (): Promise<string> => {
  try {
    const client = await auth.getClient();
    const accessTokenResponse = await client.getAccessToken();
    
    if (!accessTokenResponse.token) {
      throw new Error('Failed to retrieve access token.');
    }

    return accessTokenResponse.token;
  } catch (error) {
    console.error('Error retrieving access token:', (error as Error).message);
    throw new Error('Failed to retrieve access token.');
  }
};
