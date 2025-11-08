
import * as genai from "oci-generativeaiinference";
import { getAuthProvider } from "./authProvider";

const COMPARTMENT_ID = 'ocid1.tenancy.oc1..aaaaaaaahj7lgknz3zmkz2tabqidllay6c5bjjfydenbwyevkc6jieaevekq'
const ON_DEMAND_SERVING_MODE: genai.models.ServingMode = {
  servingType: 'ON_DEMAND',
  // @ts-ignore oci types suck
  modelId: 'ocid1.generativeaimodel.oc1.us-chicago-1.amaaaaaask7dceyapnibwg42qjhwaxrlqfpreueirtwghiwvv2whsnwmnlva'
}
const PARSE_INGREDIENTS_PROMPT = "Below, I am sending a recipe that I copied from an online article. The list that you output will be fed into my grocery list application. Only include amounts if they will be necessary for me to do my shopping. For example, include weight for meats or the number of onions, but don't include the amount of a spice."

export async function parseIngredients(recipeText: string): Promise<string[]> {
  const generativeAiChatClient = new genai.GenerativeAiInferenceClient({
    authenticationDetailsProvider: await getAuthProvider()
  });

  const chatRequest: genai.requests.ChatRequest = {
    chatDetails: {
      compartmentId: COMPARTMENT_ID,
      servingMode: ON_DEMAND_SERVING_MODE,
      chatRequest: {
        apiFormat: 'COHERE',
        maxTokens: 1000,
        message: PARSE_INGREDIENTS_PROMPT + "\n\n" + recipeText,
        responseFormat: {
          type: "JSON_OBJECT",
          schema: {
            type: "object",
            required: [
              "items"
            ],
            properties: {
              items: {
                type: "array",
                items: {
                  type: "string"
                }
              }
            }
          }
        }
      }
    }
  }


  const response = await generativeAiChatClient.chat(chatRequest) as null | genai.responses.ChatResponse;
  if (response) {
    const ingredients: { items: string[] } = JSON.parse((response.chatResult.chatResponse as genai.models.CohereChatResponse).text);
    return ingredients.items;
  } else {
    throw new Error('No response from Generative AI service');
  }
}


