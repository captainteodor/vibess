// utils/parseResponse.ts

/**
 * Safely parses AI response to match the expected structure.
 * @param response - The AI-generated response object.
 * @returns An object containing a response message and either a list of suggestions or archetypes.
 */
export const parseResponse = (response: any) => {
  try {
    console.log("Parsing response:", JSON.stringify(response, null, 2));

    const candidateData = response?.candidates?.[0]?.message?.content?.[0]?.data;
    if (candidateData?.response) {
      console.log("Parsed from primary structure:", candidateData);
      return {
        response: candidateData.response,
        suggestions: candidateData.suggestions || undefined, // Suggestions if available
        archetypes: candidateData.archetypes || undefined,   // Archetypes if available
      };
    }

    const textContent = response?.candidates?.[0]?.custom?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (textContent) {
      const parsed = JSON.parse(textContent);
      if (parsed?.response) {
        console.log("Parsed from secondary structure:", parsed);
        return {
          response: parsed.response,
          suggestions: parsed.suggestions || undefined,
          archetypes: parsed.archetypes || undefined,
        };
      }
    }

    throw new Error("Invalid response format received from prompt");
  } catch (error) {
    console.error("Error parsing response:", error);
    throw new Error("Failed to parse the response structure.");
  }
};