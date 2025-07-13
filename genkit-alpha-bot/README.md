# Genkit Alpha Bot

The Genkit Alpha Bot is a conversational application built using Genkit, Firebase Firestore, and Google Vertex AI. This bot assists users in setting up dating profiles with customized responses based on user preferences and goals. With a step-by-step approach, users receive tailored archetype suggestions and guidance that fit their objectives, providing a seamless and engaging profile setup experience.

## Features
* **Guided Profile Setup**: Interactive profile creation tailored to user preferences.
* **Archetype Suggestions**: Intelligent archetype recommendations based on relationship goals.
* **In-Memory Caching**: Efficiently caches data from Firestore, reducing database load and improving response times.
* **Contextual Conversations**: Stateful conversations that maintain user context and smooth transitions between states.
* **Vertex AI Integration**: Utilizes Vertex AI to generate personalized, natural language responses.
* **Customizable Tones**: Configurable response tones, including "friendly," "sarcastic," and more, based on user input and archetypes.

## Table of Contents
1. [Setup](#setup)
2. [Environment Variables](#environment-variables)
3. [Project Structure](#project-structure)
4. [Main Components](#main-components)
5. [API Usage](#api-usage)
6. [Development Workflow](#development-workflow)
7. [License](#license)

## Setup

### Requirements
* Node.js: Version 14 or higher
* Firebase: Ensure Firestore is enabled in Firebase for data storage.
* Genkit CLI: Install Genkit CLI to assist with plugin setups.

### Installation
1. Clone the repository:
```bash
git clone https://github.com/yourusername/genkit-alpha-bot.git
cd genkit-alpha-bot
```

2. Install dependencies:
```bash
npm install
```

3. Environment Configuration:
   * Set up environment variables as detailed below.

4. Start the development server:
```bash
npm run dev
```

### Google Cloud Setup
* Enable Vertex AI in your Google Cloud project and create your language models as needed.
* Set up Firebase with Firestore and obtain your API credentials.

## Environment Variables
Create a `.env` file in the project root with the following variables:

```plaintext
MODEL_TEMPERATURE=0.7                  # Controls model response creativity
CACHE_DURATION=60000                   # Cache duration in milliseconds
FIREBASE_API_KEY=your-firebase-api-key # Firebase API Key
FIREBASE_PROJECT_ID=your-project-id    # Firebase Project ID
FIREBASE_APP_ID=your-app-id
FIREBASE_STORAGE_BUCKET=your-storage-bucket
FIREBASE_AUTH_DOMAIN=your-auth-domain
```

## Project Structure
# Project Structure

```markdown
# src/

## config/
- `firebase.ts`
  > Firebase initialization, setting up Firestore and Firebase Auth access.
- `genkit.ts`
  > Configures Genkit with plugins (Firebase, Vertex AI) and flow state logging.

## constants/
- `flowState.ts`
  > Defines possible states in the bot's flow as constants for improved type safety.

## cache/
- `archetypeCache.ts`
  > Caches archetype data temporarily to reduce redundant Firestore reads and improve response speed.

## prompts/
- `welcomePrompt.ts`
  > Defines the initial welcome prompt structure for new users starting the profile setup flow.
- `archetypePrompt.ts`
  > Template for archetype suggestions, guiding users in selecting archetypes for their profile.

### prompts/partials/
- `defaultStyle.ts`
  > Defines default style formatting for responses, e.g., setting tone (friendly, humorous, etc.).

## data/

### data/models/
- `Archetype.ts`
  > Type definitions for archetypes, including attributes like name, description, and relationship goals.
- `UserDetails.ts`
  > Type definitions for user details, such as name, age, sex, and relationship goal.

### data/repositories/
- `archetypeRepository.ts`
  > Handles data access for archetypes, including fetching and managing archetype records in Firestore.
- `userRepository.ts`
  > Manages data access for user profiles, allowing retrieval and updating of user-specific data.

## services/
- `archetypeService.ts`
  > Core logic for handling archetype-related operations, such as filtering by user goal.
- `userService.ts`
  > Provides user-related services, including fetching and updating user data.

## flows/
- `profileSetupFlow.ts`
  > Manages the main profile setup flow, transitioning through states (welcome, archetype selection, etc.).
- `resetFlowStateFlow.ts`
  > Handles flow state resets, allowing users to restart the profile setup if needed.

## utils/
- `index.ts`
  > Contains utility functions, such as JSON parsing and response formatting for Vertex AI outputs.

# Root
- `index.ts`
  > Main entry point; initializes and starts the server, loading configurations and defining flow states.
```


## Main Components

### Flows

#### Profile Setup Flow: `profileSetupFlow.ts`
Guides users through profile creation using a series of states, transitioning as follows:
* `awaiting_welcome`: Welcomes users and prompts them to choose their relationship goal.
* `awaiting_archetype`: Suggests archetypes based on the user's selected goal.
* `awaiting_photos`: Asks users to select photos matching their chosen archetypes.
* `completed`: Final state after completing profile setup.
* `error`: Handles any errors that occur during the flow.

#### Reset Flow State: `resetFlowStateFlow.ts`
* Resets the flow state for a given conversation, allowing users to restart their profile setup if needed.

### Services

#### Prompt Service: `promptService.ts`
Generates prompts using Vertex AI's language models, configured with customizable parameters such as temperature for controlling response creativity.

Primary functions include:
* `generateWelcomeMessage`: Welcomes users and introduces the setup flow.
* `generateArchetypeSuggestion`: Suggests archetypes based on user details.

#### State Service: `stateService.ts`
* Manages the flow state for each user session, ensuring continuity.
* Works with Firestore or in-memory storage for flexibility across environments.

### Utilities
* **Response Parsing**: `parseResponse` and `parseWelcomeResponse`
  * Parses JSON responses from Vertex AI, filtering out irrelevant data (e.g., safety-related metadata) to ensure responses are user-friendly.

## API Usage

### Starting the Server
To run the server locally:
```bash
npm start
```

### Flow State Transitions
The bot maintains state across user interactions. Below is a guide to the states in profileSetupFlow:

| Flow State | Description |
|------------|-------------|
| awaiting_welcome | Prompts user to choose a relationship goal. |
| awaiting_archetype | Recommends archetypes based on user's relationship goal. |
| awaiting_photos | Requests photos that represent chosen archetypes. |
| completed | Final state after profile setup is complete. |
| error | Handles errors and prompts the user to restart the flow. |

### API Endpoints

#### 1. Profile Setup Flow
Endpoint: `POST /profileSetupFlow`

Sample Request:
```json
{
  "data": {
    "conversationId": "1234-5678-91011",
    "userDetails": {
      "firstName": "Teodor",
      "age": 22,
      "sex": "male",
      "goal": "long-term"
    }
  }
}
```

Expected Response:
```json
{
  "flowState": "awaiting_welcome",
  "response": "Hey Teodor, welcome! What's your relationship goal, long-term or short-term?",
  "suggestions": ["Long-term relationship", "Short-term relationship"]
}
```

#### 2. Archetype Suggestions
Endpoint: `POST /profileSetupFlow`

Sample Request:
```json
{
  "data": {
    "conversationId": "1234-5678-91011",
    "prompt": "Long-term relationship",
    "flowState": "awaiting_archetype",
    "userDetails": {
      "firstName": "Teodor",
      "age": 22,
      "sex": "male",
      "goal": "long-term"
    }
  }
}
```

Expected Response:
```json
{
  "flowState": "awaiting_archetype",
  "response": "Based on your long-term goal, here are some archetypes that may fit you:",
  "suggestions": ["The Visionary", "The Adventurer", "The Protector"]
}
```

#### 3. Reset Flow State
Endpoint: `POST /resetFlowStateFlow`

Sample Request:
```json
{
  "data": {
    "conversationId": "1234-5678-91011"
  }
}
```

Expected Response:
```json
{
  "message": "Flow state reset successfully for conversation ID: 1234-5678-91011"
}
```

## Development Workflow

### Testing
Run unit tests for flows and services to ensure functionality:
```bash
npm test
```

### Flow Debugging
* Use the Genkit CLI for flow state inspection to confirm expected states.

### Environment Adjustments
* Adjust `.env` file variables to control model settings and Firestore configurations.

### Error Logging
* Track error logs to diagnose issues with prompts, state transitions, and Firestore interactions.

## License
This project is licensed under the MIT License. See the LICENSE file for more information.
