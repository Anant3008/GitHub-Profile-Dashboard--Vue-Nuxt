# Technical Interview — GitHub Profile Dashboard (Vue 3 · Nuxt 3)

> This document simulates a real technical interview for this project.  
> Questions go from warm-up to deep-dive. Try answering each one before reading the model answer.

---

## Round 1 — Project Walkthrough

**Q1. Walk me through this application at a high level. What does it do, and how is it structured?**

<details>
<summary>Model answer</summary>

The app is a GitHub profile explorer built with Nuxt 3 (SSR-capable) and Vue 3. A user lands on the `/` index page, types a GitHub username into a search form, and is navigated to `/[username]` — a dynamic route that fetches two GitHub REST API endpoints in parallel:

- `GET /users/{username}` → profile data (bio, followers, company, …)
- `GET /users/{username}/repos?sort=updated&per_page=100` → up to 100 repos

The dashboard renders four child components:
- **ProfileCard** — avatar, bio, social links, follower counts
- **StatsGrid** — six computed metrics (total stars, forks, gists, account age, avg stars/repo)
- **LanguageChart** — stacked bar + per-language breakdown computed from `repo.language`
- **RepoList** — client-side filterable & sortable list

State beyond what's needed for a single render (dark mode preference) lives in a single `useDarkMode` composable backed by `localStorage`.

</details>

---

**Q2. Why did you choose Nuxt 3 over plain Vue 3 + Vite?**

<details>
<summary>Model answer</summary>

Several reasons:

1. **File-based routing** — `pages/index.vue` and `pages/[username].vue` create routes automatically. No `vue-router` config needed.
2. **Auto-imports** — `ref`, `computed`, `useState`, `useFetch`, `useHead`, `navigateTo`, `useRoute` are available everywhere without explicit imports. This keeps component files concise.
3. **`useFetch`** — Nuxt's data-fetching composable handles SSR hydration, deduplication, and serialisation transparently.
4. **SSR/SSG flexibility** — the same code can run as a server-rendered app (`nuxt build`) or a fully static site (`nuxt generate`) with zero code changes.
5. **SEO built-in** — `useHead()` updates `<head>` per-route; the `nuxt.config.ts` defines global default meta tags and Open Graph properties.

</details>

---

## Round 2 — Vue 3 Composition API

**Q3. Every component uses `<script setup>`. What does that mean and what advantages does it give?**

<details>
<summary>Model answer</summary>

`<script setup>` is syntactic sugar for the Composition API. The entire script block runs in the context of `setup()`, so:

- Top-level variables and functions are automatically exposed to the template — no `return {}` needed.
- `defineProps` and `defineEmits` are compile-time macros, not runtime calls.
- It produces smaller bundle output because the compiler can tree-shake more aggressively.
- Code is co-located: you see reactive state, computed properties, and methods in one flat scope, which mirrors how plain JavaScript works.

</details>

---

**Q4. In `StatsGrid.vue`, `totalStars` is declared as `const totalStars = computed(...)`. Why does reassigning `props.repos` in a parent automatically re-run the computation?**

<details>
<summary>Model answer</summary>

Vue's reactivity system tracks *dependencies* during getter execution. When the computed getter runs `props.repos.reduce(...)`, Vue sees that `props.repos` is a reactive reference (all props are wrapped in a reactive proxy). It records that dependency. Whenever `repos` changes in the parent, Vue marks `totalStars` as stale; the next time the template reads `totalStars.value`, the getter re-runs. This is *lazy pull-based* reactivity — the computation only re-runs when its result is actually consumed.

</details>

---

**Q5. What is `useState` in Nuxt, and how does it differ from `ref`?**

<details>
<summary>Model answer</summary>

`useState` is Nuxt's SSR-safe, cross-component shared state primitive. It:

- Creates a `ref` whose value is **shared across all components** that call `useState` with the same key (e.g. `'darkMode'`).
- Is **hydrated automatically** — if the server sets the value, the client receives it without a flash.
- Persists across navigations within the same session (unlike component-local `ref`s which reset when a component unmounts).

A plain `ref` is component-local; two components calling `ref(false)` get two independent reactive values. Two components calling `useState('darkMode', () => false)` share the same reactive reference.

</details>

---

**Q6. In `useDarkMode.ts`, why is `typeof document !== 'undefined'` needed before accessing `document.documentElement`?**

<details>
<summary>Model answer</summary>

Nuxt renders the initial HTML on the **server** (Node.js). The server environment has no DOM — `document` is undefined there. If `apply()` called `document.documentElement` unconditionally during SSR, it would throw a `ReferenceError` and crash the server render. The guard limits DOM access to client-side execution only.

The same rationale applies to the `localStorage` guard — `localStorage` is a browser API that doesn't exist in Node.

</details>

---

**Q7. When `initDarkMode()` runs and sets `isDark.value = true`, does that automatically add the `dark` class to `<html>`?**

<details>
<summary>Model answer</summary>

No, not automatically. The composable deliberately separates the *reactive state* (`isDark`) from the *DOM side-effect* (`apply()`). Setting `isDark.value` updates the reactive ref so Vue components can react (e.g. a button that shows "☀ Light Mode" vs "🌙 Dark Mode"), but the CSS class change requires the explicit `apply(isDark.value)` call that follows. This design avoids relying on a watcher for a side-effect that has to run immediately, before any render.

</details>

---

## Round 3 — Nuxt 3 Data Fetching

**Q8. The `[username].vue` page uses `await useFetch(...)` with `await` at the top level. Is that valid inside `<script setup>`, and what effect does it have?**

<details>
<summary>Model answer</summary>

Yes. Nuxt transforms `<script setup>` so that top-level `await` in a page component suspends rendering until the awaited promise resolves — both on the server and on the client during navigation. Nuxt wraps each page in an implicit `<Suspense>` boundary. On the server, the page waits for the fetch before sending HTML. On the client, `useFetch` re-uses the server-serialised payload from `window.__NUXT__`, so no second network request is made on first load.

</details>

---

**Q9. Why is `reposData` fetched as a separate `useFetch` call rather than derived from the profile endpoint?**

<details>
<summary>Model answer</summary>

The GitHub REST API exposes two separate endpoints:

- `/users/{username}` returns aggregate counts but **not** repo details.
- `/users/{username}/repos` returns full repo objects including `language`, `stargazers_count`, `forks_count`, `updated_at`, and `description`.

They run as two independent `useFetch` calls so both requests fire **in parallel** (Nuxt starts both before awaiting either), keeping total load time as low as possible.

</details>

---

**Q10. The profile fetch throws a 404 when a username doesn't exist. How does the error surface in the template?**

<details>
<summary>Model answer</summary>

`useFetch` returns a reactive `error` ref in addition to `data` and `pending`. When the GitHub API returns a 4xx/5xx, Nuxt populates `error` with an object that includes `statusCode`. The template uses `v-else-if="error"` to render an error box, and inspects `error.statusCode === 403` to distinguish a rate-limit error from a 404 "user not found" error, showing a human-readable message in each case.

</details>

---

**Q11. The repo fetch passes `{ query: { sort: 'updated', per_page: 100 } }`. Where does that end up in the actual HTTP request?**

<details>
<summary>Model answer</summary>

Nuxt's `useFetch` (built on `$fetch` / `ofetch`) serialises the `query` option as a URL query string, producing:

```
GET https://api.github.com/users/{username}/repos?sort=updated&per_page=100
```

`per_page=100` is the maximum the GitHub API allows without pagination. Since we want all repos for the language chart and stats, fetching 100 at once avoids multiple round-trips.

</details>

---

## Round 4 — CSS Architecture & Dark Mode

**Q12. No CSS framework is used. How does the theming (light/dark mode) work across components?**

<details>
<summary>Model answer</summary>

All design tokens are defined as **CSS custom properties** on the `html` element in `app.vue`:

```css
html {
  --bg-base: #f8fafc;
  --text-primary: #0f172a;
  --accent: #6366f1;
  /* … */
}
html.dark {
  --bg-base: #0f172a;
  --text-primary: #f1f5f9;
  /* … */
}
```

Every component references only `var(--text-primary)`, `var(--accent)`, etc. — never hard-coded colours. When `useDarkMode` toggles the `dark` class on `<html>`, the browser automatically re-resolves all custom property references throughout the document, and every component updates without any component-level dark-mode logic.

</details>

---

**Q13. Why are styles `scoped` in every component?**

<details>
<summary>Model answer</summary>

Vue's `scoped` attribute causes the compiler to add a unique data attribute (e.g. `data-v-3a1b2c3d`) to every element in the component's template and to every rule in its `<style>` block. This scopes CSS rules to elements rendered by that specific component, preventing class name collisions across components. For example, both `ProfileCard.vue` and `RepoList.vue` have a class named `.title` — without scoping they would override each other; with scoping they are independent.

</details>

---

**Q14. The `LanguageChart` and `RepoList` components both define a `langColor` / `langColors` mapping. What refactoring would you apply?**

<details>
<summary>Model answer</summary>

Extract the colour map into a shared composable or a plain utility module:

```ts
// composables/useLangColors.ts
export const LANG_COLORS: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  // …
}
export const langColor = (name: string) => LANG_COLORS[name] ?? '#8b8b8b'
```

Both components then import `langColor` from the composable. This eliminates duplication, makes colour updates a one-line change, and is a natural place to later fetch colours from the GitHub Linguist dataset.

</details>

---

## Round 5 — Architecture & Performance

**Q15. `LanguageChart` computes language distribution from `repo.language`. What is the limitation of this approach?**

<details>
<summary>Model answer</summary>

`repo.language` is the *primary* language — whichever language has the most bytes in the repository. A TypeScript project that also has CSS, HTML, and shell scripts will only register as `TypeScript`. The true per-language byte counts require a separate GitHub API call:

```
GET /repos/{owner}/{repo}/languages
```

This returns a map of `{ "TypeScript": 45321, "CSS": 12400, … }` for each repository. The current approach is an acceptable approximation for a public dashboard with an unauthenticated 60 req/hour limit.

</details>

---

**Q16. The app fetches up to 100 repos in a single call. What happens if a user has more than 100 repositories?**

<details>
<summary>Model answer</summary>

Only the 100 most recently updated repos are fetched. Stats (total stars, total forks) will be incomplete — for a user like `torvalds` with hundreds of repos, the dashboard will under-count. A production fix would implement pagination: loop through pages (`page=1`, `page=2`, …) until a page returns fewer than 100 items, accumulating results. With authentication (a personal access token), the rate limit rises from 60 to 5000 req/hour, making pagination practical.

</details>

---

**Q17. How does `useHead()` in `[username].vue` contribute to SEO, and when does it actually set the `<title>`?**

<details>
<summary>Model answer</summary>

On the **server**, `useHead()` writes the title into the HTML `<head>` before the response is sent, so crawlers and social-media scrapers see the correct title immediately (e.g. `"Linus Torvalds — GitHub Dashboard"`). On the **client**, after navigation, Nuxt's head manager updates `document.title` reactively, keeping the browser tab title accurate without a full page reload. Without server-side `useHead()`, client-side-only title updates would be invisible to bots that don't execute JavaScript.

</details>

---

**Q18. The app deploys on Railway with `nuxt build` (SSR mode). What is the concrete rendering difference compared to `nuxt generate` (static mode)?**

<details>
<summary>Model answer</summary>

| | `nuxt build` (SSR) | `nuxt generate` (Static) |
|---|---|---|
| **Rendering** | Node.js server renders each request on-demand | HTML files pre-rendered at build time |
| **Dynamic routes** | `/[username]` works for any username at runtime | Every possible username must be known at build time |
| **Freshness** | Always fetches live data from GitHub API | Data is frozen at build time |
| **Hosting** | Requires a Node.js runtime (Railway, Vercel, etc.) | Any CDN / static host (Netlify, GitHub Pages, S3) |

Because usernames are unbounded, SSR is the correct choice for this app. A static build could only pre-render a hardcoded list of usernames.

</details>

---

## Round 6 — Component Design

**Q19. `ProfileCard` receives the whole `user` object as a single prop. What are the trade-offs vs. passing individual fields?**

<details>
<summary>Model answer</summary>

**Passing the whole object:**
- Pros: less boilerplate, easier to add new fields without changing the prop interface, the parent doesn't need to destructure.
- Cons: the component is less self-documenting (callers can't immediately see what fields it needs), and if `user` is a large reactive object, Vue must track the entire structure even if the component only reads a few properties.

**Passing individual fields:**
- Pros: explicit contract, potential for slightly tighter change tracking.
- Cons: verbose prop list, churn when new fields are needed.

For a stable, well-typed data shape like the GitHub API's `/users/{username}` response, passing the whole object is pragmatic. Typing it with a `GitHubUser` TypeScript interface would restore the documentation benefit.

</details>

---

**Q20. `RepoList` filters and sorts repos entirely in computed properties with no Pinia or Vuex store. When would you need a store?**

<details>
<summary>Model answer</summary>

A store becomes necessary when:

1. **Multiple unrelated components** need to read or mutate the same slice of state simultaneously (e.g. a global notification system, a shopping cart).
2. **State must survive component unmounts** — in this app, navigating away from `/[username]` unmounts `RepoList` and its local `q`/`sort` refs are lost. If remembering the search query across navigations were a requirement, a store would be the right place.
3. **Complex cross-cutting mutations** — actions that update several independent pieces of state atomically are harder to coordinate with local refs.

For this dashboard, data flows in one direction (page → components) and no component modifies shared data, so local computed state is the right level of abstraction.

</details>

---

## Round 7 — TypeScript & Code Quality

**Q21. Most `.vue` files use `<script setup>` without `lang="ts"`. What are the risks and how would you migrate?**

<details>
<summary>Model answer</summary>

Without `lang="ts"`:
- Props receive type `Object` / `Array`, so TypeScript cannot catch passing the wrong shape.
- Template expressions aren't type-checked.
- Rename refactors in an IDE won't update template usages.

Migration steps:
1. Add `lang="ts"` to each `<script setup>`.
2. Define prop types with interfaces:
   ```ts
   interface GitHubUser { login: string; name: string | null; avatar_url: string; /* … */ }
   defineProps<{ user: GitHubUser }>()
   ```
3. Type composable return values and API responses.
4. Enable `strict: true` in `tsconfig.json`.

The `tsconfig.json` already extends Nuxt's preset (which enables strict mode by default), so step 4 is already done — only the component files need updating.

</details>

---

**Q22. The `ago()` helper in `RepoList.vue` is defined inline. How would you test it?**

<details>
<summary>Model answer</summary>

Extract it into a shared utility and write unit tests with Vitest (the standard test runner for Nuxt/Vite projects):

```ts
// utils/ago.ts
export function ago(dateString: string): string { … }
```

```ts
// utils/ago.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ago } from './ago'

describe('ago', () => {
  beforeEach(() => { vi.setSystemTime(new Date('2025-01-15')) })

  it('returns "today" for same-day dates', () => {
    expect(ago('2025-01-15T12:00:00Z')).toBe('today')
  })
  it('returns "yesterday" for 1-day-old dates', () => {
    expect(ago('2025-01-14T12:00:00Z')).toBe('yesterday')
  })
  it('returns "2w ago" for 14-day-old dates', () => {
    expect(ago('2025-01-01T12:00:00Z')).toBe('2w ago')
  })
})
```

`vi.setSystemTime` freezes `Date.now()` so the test is deterministic.

</details>

---

## Round 8 — Browser & Web Platform

**Q23. The `pageTransition` in `nuxt.config.ts` uses `mode: 'out-in'`. What does that mean and why is it usually preferable for page transitions?**

<details>
<summary>Model answer</summary>

`out-in` means the leaving page's exit animation completes **before** the entering page's enter animation starts. The alternatives are:

- `in-out` — new page enters first, then old page leaves (causes a visual overlap).
- `default` (no mode) — both animations run simultaneously, which looks jarring when the pages occupy the same space.

`out-in` avoids two pages being visible at the same time, producing a clean sequential fade/slide that feels natural for full-page navigation.

</details>

---

**Q24. How does the emoji favicon in `nuxt.config.ts` work? Is it reliable across browsers?**

<details>
<summary>Model answer</summary>

The favicon is an inline SVG data URI:

```html
<link rel="icon" type="image/svg+xml"
  href="data:image/svg+xml,<svg xmlns='...'><text y='.9em' font-size='90'>⚡</text></svg>">
```

The emoji is rendered as text inside a 100×100 SVG viewport. Because it's `type="image/svg+xml"`, modern browsers (Chrome, Firefox, Safari, Edge) use it directly. There is no `.ico` fallback, so older browsers (IE, older Edge) that only support `.ico` will fall back to a generic browser icon. For a developer tool dashboard, this trade-off is acceptable.

</details>

---

## Round 9 — Behavioural / Design Decisions

**Q25. A product manager asks: "Can we show contribution graphs like GitHub itself does?" How would you approach this?**

<details>
<summary>Model answer</summary>

GitHub's contribution graph data is **not available in the REST API** — it's only on the GraphQL API (the `contributionsCollection` field on `User`). Steps:

1. Register a GitHub OAuth App or use a personal access token to authenticate.
2. Use `$fetch` or `useFetch` to POST to `https://api.github.com/graphql` with a query:
   ```graphql
   query ($login: String!) {
     user(login: $login) {
       contributionsCollection {
         contributionCalendar {
           weeks { contributionDays { date contributionCount color } }
         }
       }
     }
   }
   ```
3. Render the grid as an SVG or CSS grid — each day is a coloured cell.
4. Handle authentication securely: the token must live in a Nuxt server route (`/server/api/github.ts`) to avoid exposing it to the browser.

</details>

---

**Q26. The GitHub API allows 60 unauthenticated requests per hour per IP. In a scenario with many simultaneous users on the deployed SSR instance, why is this particularly problematic?**

<details>
<summary>Model answer</summary>

When the app runs as SSR on Railway, all users share the **same server IP address**. Every profile page visit triggers at least 2 GitHub API requests from that server IP. With 60 req/hour, only 30 profile loads are possible per hour across all users before the `403 Rate Limit Exceeded` error fires for everyone.

Solutions:
1. **GitHub App / Personal Access Token on the server** — raises the limit to 5,000 req/hour per token.
2. **Server-side response caching** — Nuxt server routes (`/server/api/`) can cache responses in memory or Redis; subsequent requests for the same username hit the cache instead of GitHub.
3. **Client-side fetching** — move the `useFetch` calls to run only on the client (using `{ server: false }`), so each browser uses its own IP and its own 60 req/hour quota. The cost is losing SSR and seeing a loading spinner on first load.

</details>

---

**Q27. If you were asked to add end-to-end tests for the search flow, what would you use and what would you test?**

<details>
<summary>Model answer</summary>

I'd use **Playwright** (the recommended choice for Nuxt apps):

```ts
// e2e/search.spec.ts
import { test, expect } from '@playwright/test'

test('search for a valid user navigates to dashboard', async ({ page }) => {
  await page.goto('/')
  await page.getByPlaceholder('Enter GitHub username').fill('torvalds')
  await page.getByRole('button', { name: 'Search' }).click()
  await expect(page).toHaveURL('/torvalds')
  await expect(page.getByText('Linus Torvalds')).toBeVisible()
})

test('invalid user shows error message', async ({ page }) => {
  await page.goto('/this-user-definitely-does-not-exist-xyzabc123')
  await expect(page.getByText("User Not Found")).toBeVisible()
})

test('rate limit shows friendly message', async ({ page }) => {
  // intercept GitHub API and return 403
  await page.route('https://api.github.com/users/*', route =>
    route.fulfill({ status: 403, body: '{"message":"rate limit exceeded"}' })
  )
  await page.goto('/anyuser')
  await expect(page.getByText('Rate Limit Exceeded')).toBeVisible()
})
```

`page.route()` lets you mock the GitHub API without real network calls, making tests deterministic and fast.

</details>

---

## Quick-Fire Round

| Question | Short answer |
|---|---|
| What is the difference between `v-if` and `v-show`? | `v-if` creates/destroys the DOM node; `v-show` toggles `display:none`. Use `v-show` for frequently toggled elements. |
| What is `defineProps` and does it need to be imported? | A `<script setup>` compiler macro that declares component props. It's a compile-time construct — no import needed. |
| What does `rel="noopener"` on external links do? | Prevents the opened tab from accessing the opener via `window.opener`, closing a phishing vector. |
| Why use `flex: 1` on the search input? | Makes it grow to fill available space while the button stays fixed-size, regardless of viewport width. |
| What is `nuxt prepare` (the `postinstall` script)? | Generates `.nuxt/` type declarations so TypeScript and your IDE understand auto-imported composables and components. |
| What does `compatibilityDate: '2025-07-15'` in `nuxt.config.ts` do? | Pins Nuxt's behaviour to the feature set available on that date, preventing future Nuxt updates from silently enabling breaking changes. |
| What is `<NuxtLink>` vs `<a>`? | `<NuxtLink>` uses the Vue Router for client-side navigation (no full page reload); `<a>` causes a full browser navigation. |

---

*Good luck with your interview! The best answers combine technical accuracy with clear reasoning about trade-offs.*
