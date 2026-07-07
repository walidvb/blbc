# BLBC

Artist booking agency site, ported from Vapid to Strapi + React Router.

## Structure

- `cms/` — Strapi admin and API (deploys to Strapi Cloud)
- `web/` — React Router frontend (deploys to Vercel)
- `www/` — original Vapid site (source of truth for HTML, CSS, and JS)

The `web` app copies and compiles assets from `www` on every dev/build — no style or markup changes.

## Local development

### CMS

```bash
cp cms/.env.example cms/.env
npm run dev:cms
```

Strapi admin: http://localhost:1337/admin

### Web

```bash
cp web/.env.example web/.env
npm run dev:web
```

Frontend: http://localhost:5173

Set `STRAPI_URL=http://localhost:1337` in `web/.env`.

## Deployment

See [DEPLOY.md](DEPLOY.md).

- **CMS** → Strapi Cloud (`cms/`)
- **Web** → Vercel (`web/`, set `STRAPI_URL` to your Strapi Cloud URL)
- **Rebuilds** → Strapi webhook → Vercel Deploy Hook

## URLs

Artist pages use `/artists/{slug}`.

## Legacy Vapid site

```bash
npm start
```
