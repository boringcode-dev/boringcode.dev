# Cloudflare Pages deployment

This repo is set up for **Cloudflare Pages** plus **Cloudflare Pages Functions**.

You do **not** need a separate standalone Worker project for the backend. The file under `functions/api/github.js` is deployed in the Workers runtime automatically as part of the Pages project.

## What deploys where

- **Static frontend**: Next.js static export from `out/`
- **Backend endpoint**: `functions/api/github.js`
- **Browser API contract**:
  - `/api/github?type=org`
  - `/api/github?type=repos`

## One-time Git setup

Make sure the canonical repo is the org repo:

```bash
git remote -v
```

Recommended remotes:

- `origin` → `https://github.com/boringcode-dev/boringcode.dev.git`
- `personal` → `https://github.com/phatpham9/boringcode.dev.git`

## Cloudflare Pages project setup

In Cloudflare dashboard:

1. Go to **Workers & Pages**.
2. Click **Create application**.
3. Choose the **Pages** tab.
4. Choose **Import an existing Git repository**.
5. Select `boringcode-dev/boringcode.dev`.
6. In build settings, start from the **Next.js (Static HTML Export)** preset.

Use these settings:

- **Production branch**: `main`
- **Build command**: `npx next build`
- **Build output directory**: `out`
- **Root directory**: `/`

Notes:

- Start from the Cloudflare **Next.js (Static HTML Export)** preset.
- Cloudflare's preset uses `npx next build`, which is fine for this repo.
- Dependency installation still follows the detected lockfile/package-manager behavior during the Pages build.

## Environment variables / secrets

Add this in the Cloudflare Pages project settings:

- **Variable name**: `GITHUB_TOKEN`
- **Type**: secret
- **Environment**: Production and Preview

Use a token that can read the org metadata and public repositories.

Notes:

- The site will still work without a token, but rate limits are tighter.
- For a quick start, a PAT is fine.
- For stricter org ownership later, migrate to a GitHub App.

## Auto deploy behavior

After the Pages project is connected to GitHub:

- every push to `main` triggers a production deploy
- every pull request / branch push gets a preview deploy
- the Pages Function under `functions/` deploys together with the static site

You do not need a second CI pipeline just to deploy the API route.

## Local verification

Install dependencies:

```bash
pnpm install
```

Build the static site:

```bash
npx next build
```

Optional local Pages preview with Functions:

```bash
pnpm dlx wrangler pages dev out
```

That preview should serve:

- the static site from `out/`
- the Pages Function from `functions/`

## Post-deploy verification checklist

After the first deploy, verify:

1. `/api/github?type=org` returns JSON
2. `/api/github?type=repos` returns JSON
3. homepage renders repo cards
4. dark mode still works
5. service worker registers from `/sw.js`
6. preview deployments work on branch pushes / pull requests
7. custom domain `boringcode.dev` is attached to the Pages project

## Custom domain cutover

After preview looks correct:

1. Open the Pages project.
2. Go to **Custom domains**.
3. Add `boringcode.dev`.
4. Follow Cloudflare DNS prompts.
5. Wait for certificate issuance and domain activation.

## Rollback

If a deploy is bad:

- use the Cloudflare Pages deployment history to redeploy a previous good build
- or revert the bad commit on `main`

Because the backend is attached to the same Pages project, rollback restores both frontend and function together.
