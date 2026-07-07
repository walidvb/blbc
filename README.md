# BLBC

Artist booking agency site, ported from Vapid to Prismic + React Router.

## Structure

- `web/` — React Router frontend + Prismic custom types (deploys to Vercel)
- `www/` — original Vapid site (source of truth for HTML, CSS, and JS)

The `web` app copies and compiles assets from `www` on every dev/build — no style or markup changes.

## Local development

```bash
cp web/.env.example web/.env
npm run push:types
npm run dev:web
```

Frontend: http://localhost:5173

Create a repo at [prismic.io](https://prismic.io), set `PRISMIC_REPOSITORY` in `web/.env`, generate a write token (`npx prismic token create --write`) for `push:types`, and add content in the writing room.

## Deployment

See [DEPLOY.md](DEPLOY.md).

- **CMS** → Prismic
- **Web** → Vercel (`web/`, set `PRISMIC_REPOSITORY`)
- **Rebuilds** → Prismic webhook → Vercel Deploy Hook

## URLs

Artist pages use `/artists/{slug}`.

## Legacy Vapid site

```bash
npm start
```
