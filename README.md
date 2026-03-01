# MetricCard

Turn metrics into shareable visuals. Create crisp text, growth, and payout cards optimized for X (Twitter). Download as PNG in one click.

## Features

- **Text cards** — Paste build-in-public style posts; numbers and highlights are auto-styled
- **Growth cards** — Animated growth graphs (start/end values, label, time period)
- **Payout cards** — Platform, amount, time period, optional verified badge
- **Themes** — Dark and light
- **Aspect ratios** — Square (1:1) and portrait (4:5) — portrait available in Pro mode
- **Export** — PNG at 2x resolution, no sign-up required

## Tech stack

- [Next.js](https://nextjs.org/) 14 (App Router)
- [React](https://react.dev/) 18
- [Tailwind CSS](https://tailwindcss.com/)
- [html-to-image](https://github.com/bubkoo/html-to-image) for PNG export
- TypeScript

## Getting started

### Prerequisites

- Node.js 18+
- npm (or pnpm/yarn)

### Install and run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Other scripts

```bash
npm run build   # Production build
npm run start   # Start production server
npm run lint    # Run ESLint
```

## Project structure

```
├── app/              # Next.js App Router (layout, page)
├── components/       # Card components (TextCard, GrowthCard, PayoutCard)
├── lib/              # Utilities (exportCardAsPng, number formatting)
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## License

Free and open-source.
