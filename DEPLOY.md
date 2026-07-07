# Deployment

## Strapi Cloud (CMS)

1. Create a project at [cloud.strapi.io](https://cloud.strapi.io)
2. Connect this repository and set the app directory to `cms/`
3. Deploy — Strapi Cloud provides the database, media storage, and hosting
4. In Strapi Cloud project settings, add environment variable:
   - `CORS_ORIGIN=https://your-vercel-domain.vercel.app`
Local Strapi config already sets public read permissions for Artist, About, and Site.

## Web (Vercel)

1. Import the repository
2. Set root directory to `web`
3. Add environment variable:
   - `STRAPI_URL=https://your-project.strapiapp.com` (from Strapi Cloud)
4. Deploy

`web/react-router.config.ts` pre-renders all routes at build time. `Cache-Control` headers enable CDN revalidation.

Trigger a Vercel deploy after Strapi is populated so artist pages are included in the build.

## Strapi webhook → Vercel rebuild

1. In Vercel: Project Settings → Git → Deploy Hooks → create a hook
2. In Strapi admin: Settings → Webhooks → create webhook
   - URL: your Vercel deploy hook URL
   - Events: `entry.publish`, `entry.unpublish`

Add content manually in the Strapi admin, then trigger a Vercel deploy.
