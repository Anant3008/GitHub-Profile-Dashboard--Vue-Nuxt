# GitHub Profile Dashboard

A modern, responsive GitHub profile explorer built with **Nuxt 3** and **Vue 3**. Search any GitHub user and instantly see their profile, stats, language distribution, and repositories — all in a polished, dark-mode-ready UI.

## Features

- **Profile Search** — Search any GitHub username from a clean landing page
- **Profile Card** — Avatar, bio, company, location, blog, follower/following counts
- **Stats Grid** — Total stars, forks, public repos, gists, account age, average stars per repo
- **Language Chart** — Stacked bar + detailed breakdown of programming languages used
- **Repository List** — Filterable & sortable (by stars, forks, name, or last updated), with search
- **Dark Mode** — Toggle between light and dark themes, persisted via localStorage
- **Responsive** — Fully mobile-friendly with adaptive layouts
- **Page Transitions** — Smooth fade + slide animations between pages
- **SEO Ready** — Dynamic `<head>` meta tags, Open Graph support, emoji favicon
- **Rate Limit Handling** — Friendly error message when GitHub API limit is reached

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Nuxt 3](https://nuxt.com) (file-based routing, auto-imports, SSR) |
| UI | [Vue 3](https://vuejs.org) Composition API (`<script setup>`) |
| Styling | Scoped CSS + CSS Custom Properties (zero dependencies) |
| Data | GitHub REST API (no auth required) |
| State | `useState` composable for shared dark mode state |
| Deployment | Supports static generation (`nuxt generate`) or SSR |

## Project Structure

```
app/
├── app.vue                 # Root — global CSS variable theming system
├── composables/
│   └── useDarkMode.ts      # Dark mode toggle + localStorage persistence
├── layouts/
│   └── default.vue         # Sticky header, dark mode button, footer
├── pages/
│   ├── index.vue           # Search landing page
│   └── [username].vue      # Dynamic profile dashboard
└── components/
    ├── ProfileCard.vue     # User profile display
    ├── StatsGrid.vue       # 6-cell stats overview
    ├── LanguageChart.vue   # Stacked bar + detailed language rows
    └── RepoList.vue        # Searchable, sortable repo list
```

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server at http://localhost:3000
npm run dev

# Build for production
npm run build

# Generate static site
npm run generate
```

## Dark Mode Approach

The app uses **CSS custom properties** defined on `html` (light) and `html.dark` (dark). Every component references `var(--bg-card)`, `var(--text-primary)`, etc. — no scoped dark-mode selectors needed. The browser resolves variables automatically based on the `dark` class on `<html>`.

## API Notes

- Uses unauthenticated GitHub REST API (60 requests/hour limit)
- Fetches user profile from `/users/{username}`
- Fetches up to 100 repos from `/users/{username}/repos?sort=updated&per_page=100`
- Rate limit errors are detected and shown with a friendly message

## Screenshots

> Run the app locally and explore light + dark modes!

---

Built by **Anant**
