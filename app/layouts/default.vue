<template>
  <div class="app-layout">
    <header class="header">
      <div class="container header-content">
        <NuxtLink to="/" class="logo-link">
          <h1 class="logo">GitHub Dashboard</h1>
        </NuxtLink>
        <button @click="toggleDarkMode" class="dark-toggle" :title="isDark ? 'Light mode' : 'Dark mode'">
          {{ isDark ? '☀️' : '🌙' }}
        </button>
      </div>
    </header>

    <main class="main">
      <slot />
    </main>

    <footer class="footer">
      <div class="container">
        <p>Built by Anant</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
const { isDark, toggleDarkMode, initDarkMode } = useDarkMode()
onMounted(() => { initDarkMode() })
</script>

<style scoped>
.app-layout { min-height: 100vh; display: flex; flex-direction: column; }

.header {
  background: linear-gradient(135deg, #1e293b, #6366f1);
  color: #fff;
  padding: 0.9rem 0;
  box-shadow: 0 2px 12px rgba(0,0,0,0.15);
  position: sticky; top: 0; z-index: 50;
}

.container { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; }
.header-content { display: flex; justify-content: space-between; align-items: center; }
.logo-link { text-decoration: none; }
.logo { font-size: 1.3rem; font-weight: 700; color: #fff; }

.dark-toggle {
  background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.25);
  color: #fff; width: 40px; height: 40px; border-radius: 10px; cursor: pointer;
  font-size: 1.1rem; display: grid; place-items: center;
  transition: background 0.2s, transform 0.15s;
}
.dark-toggle:hover { background: rgba(255,255,255,0.25); transform: scale(1.08); }
.dark-toggle:active { transform: scale(0.94); }

.main { flex: 1; padding: 2rem 0; }

.footer {
  padding: 1.1rem 0; text-align: center; font-size: 0.85rem;
  color: var(--text-muted); border-top: 1px solid var(--border);
}
</style>
