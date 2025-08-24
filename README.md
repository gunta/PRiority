# PRiority Landing Page

A stunning landing page for PRiority - Zero-friction GitHub issue funding with AI-powered estimation and execution.

## 🚀 Features

- **Beautiful Dark Theme**: Modern, sleek design with gradient accents
- **Responsive Layout**: Works perfectly on all devices
- **Smooth Animations**: Engaging animations and transitions
- **Call-to-Action Focused**: Clear CTA to build community interest
- **GitHub Pages Ready**: Automatic deployment via GitHub Actions

## 📦 Tech Stack

- **Astro**: Fast, modern static site generator
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript**: Type-safe development
- **GitHub Actions**: Automated deployment

## 🛠️ Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

## 🌐 Deployment

### GitHub Pages Configuration

1. **Update the Astro config** in `astro.config.mjs`:
   - Replace `yourusername` with your GitHub username
   - If deploying to root domain, remove the `base` property

2. **Enable GitHub Pages**:
   - Go to Settings → Pages in your GitHub repository
   - Set Source to "GitHub Actions"

3. **Push to main branch**:
   - The GitHub Action will automatically build and deploy your site
   - Your site will be available at `https://yourusername.github.io/PRiority`

## 🎨 Customization

### Update Social Links
Edit the Twitter handle in `src/components/CTA.astro`:
```html
<a href="https://twitter.com/intent/follow?screen_name=yourhandle">
```

### Modify Content
- Hero section: `src/components/Hero.astro`
- Features: `src/components/Features.astro`
- Call-to-action: `src/components/CTA.astro`

### Styling
- Global styles: `src/styles/global.css`
- Tailwind config: `tailwind.config.mjs` (if needed)

## 📝 Project Structure

```
PRiority/
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions deployment workflow
├── public/
│   └── favicon.svg           # Site favicon
├── src/
│   ├── components/
│   │   ├── Hero.astro        # Hero section
│   │   ├── Features.astro    # Features showcase
│   │   └── CTA.astro         # Call-to-action section
│   ├── layouts/
│   │   └── Layout.astro      # Base layout
│   ├── pages/
│   │   └── index.astro       # Main landing page
│   └── styles/
│       └── global.css        # Global styles and Tailwind
├── astro.config.mjs          # Astro configuration
├── package.json              # Project dependencies
└── README.md                 # This file
```

## 🤝 The Vision

PRiority transforms GitHub issue management by introducing market-driven prioritization through seamless, repo-owned funding rails. Built entirely on GitHub Actions with no external infrastructure, it enables maintainers to sustainably monetize their work while giving stakeholders a direct path to accelerate critical features and fixes.

**Core Promise**: Funding creates priority signals, not delivery guarantees. Every dollar accelerates work while respecting maintainer autonomy.

## 📄 License

MIT

---

**The future of open source is funded. The future is PRiority.**