# boringcode.dev

A statically exported Next.js site for showcasing open-source projects from the `boringcode-dev` GitHub organization.

## Live site

- **Production**: [https://boringcode.dev](https://boringcode.dev)

## What it does

- Renders the BoringCode.dev organization homepage with custom branding
- Fetches organization metadata and featured repositories from GitHub
- Shows the top featured repositories on the landing page
- Links to the full repository list on GitHub
- Supports light/dark theme switching
- Provides installable PWA behavior with a service worker and manifest
- Includes sitemap, robots.txt, and structured metadata for SEO

## Tech stack

- **Framework**: Next.js 15 (App Router)
- **Rendering model**: Static HTML export
- **Styling**: Tailwind CSS
- **UI components**: shadcn/ui
- **Icons**: Lucide React
- **Frontend hosting**: Cloudflare Pages
- **Backend endpoint**: Cloudflare Pages Functions
- **PWA**: Service worker + web app manifest

## Runtime architecture

The site is deployed as a static export and uses a Pages Function for GitHub data.

- Static frontend output: `out/`
- Pages Function: `functions/api/github.js`
- API contract used by the browser:
  - `/api/github?type=org`
  - `/api/github?type=repos`

The Pages Function keeps GitHub access server-side and optionally uses `GITHUB_TOKEN` for higher rate limits.

## Repository behavior

For repository data, the backend:

- fetches public repositories from `boringcode-dev`
- filters out `.github` and `test` repositories
- sorts featured repositories by star count
- returns the top 9 repositories for the homepage
- returns `totalCount` for the full filtered set

## Local development

```bash
# Clone the repository
git clone https://github.com/boringcode-dev/boringcode.dev.git
cd boringcode.dev

# Install dependencies
pnpm install

# Run the development server
pnpm dev

# Build the production static export
npx next build
```

## Environment variables

```bash
# Optional but recommended for higher GitHub API rate limits
GITHUB_TOKEN=your_github_token_here
```

## Cloudflare deployment

This project is configured for:

- **Cloudflare Pages** for the static frontend
- **Cloudflare Pages Functions** for `/api/github`

Required deployment settings:

- **Framework preset**: `Next.js (Static HTML Export)`
- **Build command**: `npx next build`
- **Build output directory**: `out`
- **Deploy command**: leave empty
- **Root path**: `/`

For the detailed deployment runbook, see:

- [`docs/cloudflare-pages.md`](docs/cloudflare-pages.md)

## Project structure

- `app/` — Next.js app routes and metadata routes
- `components/` — UI and page components
- `functions/` — Cloudflare Pages Functions
- `public/` — static assets, icons, manifest, service worker
- `docs/` — deployment notes

## License

This project is open source and available under the [MIT License](LICENSE).

## Contributing

Contributions are welcome. Useful contributions include:

- bug fixes
- documentation improvements
- UI polish
- deployment and operational improvements

## Contact

- **Website**: [boringcode.dev](https://boringcode.dev)
- **GitHub**: [@boringcode-dev](https://github.com/boringcode-dev)
- **Location**: Vietnam 🇻🇳
