# Substrate Metadata Explorer (Nuxt)

A Nuxt 3 web app that connects to a Substrate-based blockchain via `wss://` endpoint, fetches runtime metadata as JSON, and renders it in a Swagger-style explorer with smart filtering.

## Features

- Centered endpoint search bar for chain connection
- Enter key or button submit to fetch metadata
- Top-left JSON download button
- Swagger-inspired metadata docs layout
- Smart metadata search (fuzzy + alias-expanded filtering)
- Mobile and desktop responsive layout
- Lucide icons used for all icons

## Local Development

```bash
npm install
npm run dev
```

Then open the local URL printed by Nuxt.

## Production Build

```bash
npm run generate
```

Static output is generated in `.output/public`.

## GitHub Pages Deployment

Deployment is automated via GitHub Actions workflow in `.github/workflows/deploy-pages.yml`.

- Push to `main` triggers build and deploy.
- `workflow_dispatch` is available for manual runs.
- `NUXT_APP_BASE_URL` is computed automatically from repository name.
