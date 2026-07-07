# Deployment

## Prismic (CMS)

1. Create a repository at [prismic.io](https://prismic.io)
2. Push custom types from this repo:

```bash
cp web/.env.example web/.env
# set PRISMIC_REPOSITORY and PRISMIC_WRITE_TOKEN (npx prismic token create --write)
npm run push:types
```

3. In Prismic: create and publish the **Site** singleton, then add **Artist** documents
4. Settings → API & Security → create an access token if the API is private

## Web (Vercel)

1. Import the repository
2. Root directory should be `.` (repo root, not `web`)
3. Add environment variables:
   - `PRISMIC_REPOSITORY` — your repo name (e.g. `blbc`)
   - `PRISMIC_ACCESS_TOKEN` — optional, only if the API is not public
4. Deploy

`web/react-router.config.ts` pre-renders all routes at build time. `Cache-Control` headers enable CDN revalidation.

Trigger a Vercel deploy after artists are published so their pages are included in the build.

## Prismic webhook → Vercel rebuild

1. In Vercel: Project Settings → Git → Deploy Hooks → create a hook
2. In Prismic: Settings → Webhooks → add your Vercel deploy hook URL
   - Trigger on document publish and unpublish

Add content in the Prismic writing room, then trigger a Vercel deploy (or rely on the webhook).
