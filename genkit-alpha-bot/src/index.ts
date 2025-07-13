import 'dotenv/config'; // Load environment variables first
import { startFlowsServer } from '@genkit-ai/flow';
import './config/genkit'; // Ensure Genkit configuration loads and applies settings
import { profileSetupFlow } from './flows/profileSetupFlow';
import { resetState } from './flows/resetState';

const main = async () => {
  try {
    console.log('Initializing Genkit with custom configuration...');

    // Define flows as an array for the server
    const flows = [profileSetupFlow, resetState ];

    // Set default port to 3000 or use environment variable if available
    const port = process.env.PORT || 3000;

console.log("About to start flows server with the following flows:", flows);
startFlowsServer({
  flows,
  port: Number(port),
});
console.log("startFlowsServer call completed.");


    console.log(`Server started successfully on port ${port}.`);
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

main();
