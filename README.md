This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Supabase Integration

This project supports Supabase for data persistence and authentication. To enable Supabase integration:

1. Create a Supabase project at [https://supabase.com](https://supabase.com)
2. Copy your Supabase URL and anon key
3. Create a `.env.local` file in the root directory
4. Add the following variables to `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
5. Set up the database schema by running the SQL commands from `supabase/schema.sql` in your Supabase SQL editor
6. Enable email authentication in your Supabase project settings

## Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # React components
├── contexts/            # React context providers
├── lib/                 # Utility functions and types
├── services/            # Business logic services
└── middleware.ts        # Next.js middleware
```

## Authentication

The application uses Supabase Auth for user authentication:
- Users can sign up with email and password
- Users can log in with existing credentials
- Protected routes require authentication
- User data is automatically associated with the authenticated user

## Data Models

The application uses three main data models:

1. **Procedures** - Main procedure entities with metadata
2. **Procedure Steps** - Individual steps within a procedure
3. **Daily Schedules** - Scheduling of procedures for specific dates

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.