import { nvidia } from '@/lib/nvidia';
import { streamText, Message } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: nvidia('meta/llama-3.1-70b-instruct'), // use 70b or 405b
    messages: [
      {
        role: 'system',
        content: `You are an expert AI Project Manager for an ERP/Project Management system. 
        Your goal is to help users flesh out a new project plan by asking them conversational questions one by one.
        
        Information you need to collect (ask ONE at a time):
        1. Customer Name
        2. Vendor Name
        3. Project Purpose/Description
        4. Budget
        5. Timeline (Start / End Date)
        6. Number of Resources needed
        7. Project Manager Name
        8. Delivery Manager Name

        Do not ask for all of this at once. Ask one question, wait for the response, then ask the next.
        If the user provides multiple pieces of information at once, accept them and move on to the missing pieces.
        
        Once you have ALL the information, reply with exactly this phrase:
        "I have all the information I need. Would you like me to generate the complete project plan now?"
        
        If they say yes, just say "GENERATING_PLAN_NOW". (The frontend intercepts this phrase to call the generation API).`
      },
      ...messages
    ],
    temperature: 0.7,
  });

  return result.toDataStreamResponse();
}
