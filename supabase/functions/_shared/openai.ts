import { ChatOpenAI, OpenAIEmbeddings } from "npm:@langchain/openai"

const openaiKey = Deno.env.get("OPENAI_API_KEY")!

export const llm = new ChatOpenAI({ 
  apiKey: openaiKey, 
  model: Deno.env.get("OPENAI_CHAT_MODEL")!
});

export const embeddings = new OpenAIEmbeddings({ 
  apiKey: openaiKey, 
  model: Deno.env.get("OPENAI_EMBEDDING_MODEL")!
});