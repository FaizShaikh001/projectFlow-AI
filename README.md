# ProjectFlow AI

ProjectFlow AI is a complete, production-ready Project Management and ERP system.

## Stack
- Next.js 14 App Router
- Tailwind CSS & shadcn/ui components
- Supabase PostgreSQL (Anon Key Data Fetching)
- NVIDIA NIM API for autonomous Llama-based project generation
- Recharts for Analytics
- `@react-pdf/renderer` for automatic localized PDF invoice generation

## Getting Started

1. Set your environment variables in `.env.local`
2. Run database initializations from the prompt in your Supabase SQL Editor
3. `npm install`
4. `npm run dev`

## Deployment

Simply connect to Vercel and it will automatically deploy the Next.js `build`. Ensure your Environment Variables are configured in the Vercel dashboard.
