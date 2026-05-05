import { createOpenAI } from '@ai-sdk/openai';

// Custom provider wrapper to make AI SDK work with NVIDIA NIM API
export const nvidia = createOpenAI({
  baseURL: 'https://integrate.api.nvidia.com/v1',
  apiKey: process.env.NVIDIA_NIM_API_KEY,
});
