import { nvidia } from '@/lib/nvidia';
import { generateText } from 'ai';
import { NextResponse } from 'next/server';

export const maxDuration = 60; // Generation might take longer

export async function POST(req: Request) {
  try {
    const { context } = await req.json(); // context is the summary of collected info

    const result = await generateText({
      model: nvidia('meta/llama-3.1-70b-instruct'),
      prompt: `Act as a senior technical project manager. Based on the following project context, generate a complete, detailed project plan in strict JSON format. 
      No markdown wrapping, just raw JSON. Ensure task dependencies make logical sense.

      Context:
      ${context}

      Output MUST be exactly this JSON structure:
      {
        "project": { 
          "name": "string", 
          "description": "string", 
          "budget": number, 
          "start_date": "YYYY-MM-DD", 
          "end_date": "YYYY-MM-DD" 
        },
        "milestones": [
          { "name": "string", "due_date": "YYYY-MM-DD", "description": "string" }
        ],
        "tasks": [
          { 
            "name": "string", 
            "description": "string", 
            "start_date": "YYYY-MM-DD", 
            "end_date": "YYYY-MM-DD", 
            "estimated_hours": number, 
            "dependencies": ["Task Name 1", "Task Name 2"], 
            "priority": "medium" 
          }
        ],
        "suggested_resources": [
          { "role": "string", "count": number }
        ],
        "timeline_summary": "string"
      }`,
      temperature: 0.2, // lower temp for strict JSON
    });

    let text = result.text.trim();
    if (text.startsWith("\`\`\`json")) {
      text = text.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "");
    }
    
    const plan = JSON.parse(text);

    return NextResponse.json(plan);
  } catch (error: any) {
    console.error("Failed to generate plan:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
