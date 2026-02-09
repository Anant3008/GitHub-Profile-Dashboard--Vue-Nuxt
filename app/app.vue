<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
/* ===== RESET ===== */
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

/* ===== CSS VARIABLES — LIGHT (default) ===== */
html {
  --bg-page: #f0f2f5;
  --bg-card: #ffffff;
  --bg-card-nested: #f9fafb;
  --bg-input: #ffffff;
  --border: #e5e7eb;
  --border-hover: #c7d2fe;
  --text-primary: #1f2328;
  --text-secondary: #4b5563;
  --text-muted: #6b7280;
  --accent: #6366f1;
  --accent-light: #818cf8;
  --accent-hover: #4f46e5;
  --accent-subtle: rgba(99, 102, 241, 0.08);
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.06);
  --shadow-md: 0 4px 12px rgba(99,102,241,0.1);
  --track-bg: #e5e7eb;
  --badge-bg: #f3f4f6;
  --badge-text: #4b5563;
}

/* ===== CSS VARIABLES — DARK ===== */
html.dark {
  --bg-page: #0d1117;
  --bg-card: #161b22;
  --bg-card-nested: #0d1117;
  --bg-input: #0d1117;
  --border: #30363d;
  --border-hover: #4338ca;
  --text-primary: #e6edf3;
  --text-secondary: #d1d5db;
  --text-muted: #8b949e;
  --accent: #a5b4fc;
  --accent-light: #c7d2fe;
  --accent-hover: #818cf8;
  --accent-subtle: rgba(129, 140, 248, 0.1);
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.3);
  --shadow-md: 0 4px 12px rgba(129,140,248,0.12);
  --track-bg: #21262d;
  --badge-bg: #21262d;
  --badge-text: #9198a1;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
  background: var(--bg-page);
  color: var(--text-primary);
  transition: background-color 0.3s, color 0.3s;
  -webkit-font-smoothing: antialiased;
}

/* ===== PAGE TRANSITIONS ===== */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
</style>
