# Newposty

AI social studio: chat with Claude, connect accounts through Zernio, and publish or schedule posts.

## Stack

- Next.js App Router + TypeScript + Tailwind
- Supabase Auth, Postgres, and Storage
- Anthropic Claude for the assistant
- [Zernio](https://docs.zernio.com) for social OAuth and `createPost`

## Local setup

```bash
npm install
cp .env.example .env.local
```

Fill in:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `ANTHROPIC_API_KEY`
- `ZERNIO_API_KEY`
- `NEXT_PUBLIC_SITE_URL`

```bash
npm run dev
```

## Flow

1. Sign up / sign in
2. Connect a platform from Accounts (Zernio hosted OAuth)
3. Draft in Chat, then Publish now or Schedule
