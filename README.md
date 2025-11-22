# NEXUS — Futuristic Indie Game Storefront

This repository is a single-page, production-ready (scaffold) storefront built with Next.js (app router) and TypeScript. It showcases a modern cyberpunk/neumorphic design with WebGL hero effects, glassmorphic cards, and a mock AI personalization flow.

Features included in this scaffold:
- Next.js 15 + React 19 (configured in `package.json`)
- TypeScript (strict mode)
- Tailwind CSS and global styles
- Lenis smooth scroll integration
- Three.js background via `@react-three/fiber` and `@react-three/drei`
- Framer Motion for micro-interactions
- Zustand (for state management scaffolding)
- Supabase client stub (mocked interactions)
- Mock dataset of 50 gorgeous fictional games in `src/data/games.ts`

Quick start (Windows PowerShell):
```powershell
npm install
npm run dev
```

The application is configured to run on port **3131**. Open your browser and navigate to `http://localhost:3131`.

Notes:
- Several advanced features are mocked (real-time collaborative browsing, WebGPU previews, tipping flows). They are scaffolded for integration with real backends (Supabase Realtime, WebRTC, payment rails).
- The WebGL hero is implemented in `src/app/components/HeroWebGLBackground.tsx`. Tweak particle counts for performance on low-end devices.

Next steps I can take for you:
- Wire up real Supabase auth and database
- Implement real-time collaboration using Supabase Realtime or WebRTC
- Add server-side endpoints for payments and tipping
- Polish accessibility and automated tests
# NEXUS Game Storefront

Welcome to NEXUS, a futuristic cyberpunk indie game storefront built with Next.js 15 and React 19. This project aims to provide an immersive and advanced platform for indie game developers and players, surpassing existing platforms like itch.io.

## Features

- **Dynamic Game Listings**: Browse through a wide variety of indie games with infinite scrolling and dynamic filtering options.
- **Game Details**: View detailed information about each game, including descriptions, pricing, and a "Play in browser" option.
- **User Authentication**: Secure sign-in and sign-up functionality integrated with Supabase for user management.
- **Shopping Cart**: Easily manage your selected games with a user-friendly cart interface.
- **Checkout Process**: Seamless checkout experience with support for both crypto and fiat payment systems.
- **Search Functionality**: Quickly find specific games using the integrated search bar.
- **Custom Aesthetic**: A unique dark mode design with glassmorphism effects and smooth scrolling for an engaging user experience.

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/NEXUS.git
   cd NEXUS
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add your Supabase and payment API keys.

4. Run the development server:
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`.

## Deployment

To build the project for production, run:
```
npm run build
```
Then, you can deploy the `out` directory to your preferred hosting service.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

## Acknowledgments

- Next.js for the powerful framework.
- Supabase for user authentication and database management.
- Tailwind CSS for the beautiful styling.

Enjoy your journey through the NEXUS!