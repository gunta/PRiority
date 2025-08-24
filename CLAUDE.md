# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

- **Development server**: `npm run dev` - Starts Astro dev server with hot reload
- **Build**: `npm run build` - Builds the site for production 
- **Preview**: `npm run preview` - Preview the built site locally
- **Astro CLI**: `npm run astro` - Access Astro CLI commands

## Architecture & Structure

This is an **Astro-based landing page** for PRiority, a GitHub issue funding platform. The project uses:

- **Astro** with TypeScript for static site generation
- **Tailwind CSS v4** (via Vite plugin) for styling
- **Framer Motion** and **GSAP** for animations
- **Component-based architecture** with `.astro` files

### Key Components

- `src/components/Hero.astro` - Main hero section with logo, CTA buttons, and stats cards
- `src/components/TiltedCard.astro` - Reusable animated card component
- `src/components/Features.astro` - Feature showcase section
- `src/components/CTA.astro` - Call-to-action section
- `src/layouts/Layout.astro` - Base HTML layout with global styles

### Styling Approach

- Uses **utility-first Tailwind CSS** with custom CSS for complex animations
- Components contain scoped `<style>` sections for component-specific styles
- Global styles in `src/styles/global.css`
- Gradient text effects and glow buttons are common patterns

### Deployment

- Configured for **GitHub Pages** deployment at `https://gunta.github.io/PRiority`
- Site and base URLs are configured in `astro.config.mjs`
- Uses GitHub Actions for automated deployment (workflow not visible in current structure)

### Project Context

PRiority is a concept for "Zero-friction GitHub issue funding with AI-powered estimation and execution" - a platform to enable funding of GitHub issues to prioritize development work.