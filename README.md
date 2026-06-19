# boringcode.dev

A minimal landing page showcasing open-source projects from the boringcode-dev GitHub organization.

[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev)

## 🚀 Live Site

**[https://boringcode.dev](https://boringcode.dev)**

## ✨ Features

- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Dark Mode Support** - Toggle between light and dark themes
- **PWA Ready** - Install as a native app on iOS and Android
- **GitHub Integration** - Automatically fetches and displays repositories
- **SEO Optimized** - Proper meta tags, structured data, and sitemap
- **Performance Focused** - Fast loading with optimized assets

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Deployment**: Cloudflare Pages + Pages Functions
- **PWA**: Service Worker with offline support

## 📱 PWA Features

- Install as native app on mobile devices
- Offline support with service worker
- Custom app icons and splash screens
- iOS Safari status bar optimization
- Background sync capabilities

## 🎨 Design

- Minimal, clean interface
- Custom BoringCode.dev branding
- Smooth hover animations
- Responsive grid layout
- Accessibility focused

## 🔧 Development

This project is built and maintained using [v0.dev](https://v0.dev), Vercel's AI-powered frontend development tool.

### Local Development

```bash
# Clone the repository
git clone https://github.com/boringcode-dev/boringcode.dev.git

# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
npx next build
```

### Environment Variables

```bash
# Optional but recommended for higher API rate limits
GITHUB_TOKEN=your_github_token_here
```

## ☁️ Cloudflare Deployment

This project is configured for:

- **Cloudflare Pages** for the static frontend
- **Cloudflare Pages Functions** for `/api/github`

The browser contract stays the same:

- `/api/github?type=org`
- `/api/github?type=repos`

For the full setup and auto-deploy guide, see:

- [`docs/cloudflare-pages.md`](docs/cloudflare-pages.md)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 📞 Contact

- **Website**: [boringcode.dev](https://boringcode.dev)
- **GitHub**: [@boringcode-dev](https://github.com/boringcode-dev)
- **Location**: Vietnam 🇻🇳

---

Built with ❤️ using [v0.dev](https://v0.dev)
