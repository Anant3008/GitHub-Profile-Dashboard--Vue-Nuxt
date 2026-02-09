<template>
  <div class="hero">
    <div class="hero-inner">
      <span class="icon">⚡</span>
      <h2 class="heading">Discover GitHub Profiles</h2>
      <p class="sub">Explore developers and their amazing projects</p>

      <form @submit.prevent="go" class="form">
        <input v-model="username" type="text" placeholder="Enter GitHub username (e.g., torvalds)" class="input" autofocus />
        <button type="submit" class="btn">Search</button>
      </form>

      <div class="examples">
        <p class="examples-label">Try examples:</p>
        <div class="chips">
          <NuxtLink to="/torvalds" class="chip">torvalds</NuxtLink>
          <NuxtLink to="/gaearon" class="chip">gaearon</NuxtLink>
          <NuxtLink to="/anant3008" class="chip">anant3008</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const username = ref('')
const go = () => { if (username.value.trim()) navigateTo(`/${username.value.trim()}`) }
</script>

<style scoped>
.hero { min-height: 72vh; display: flex; align-items: center; justify-content: center; padding: 2rem 1.5rem; }
.hero-inner { max-width: 560px; width: 100%; text-align: center; }
.icon { font-size: 3.5rem; display: block; margin-bottom: 1rem; }

.heading { font-size: 2.5rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.5px; margin-bottom: 0.5rem; }
.sub { color: var(--text-muted); font-size: 1.05rem; margin-bottom: 2rem; }

.form { display: flex; gap: 0.5rem; margin-bottom: 2rem; }

.input {
  flex: 1; padding: 0.9rem 1.25rem; font-size: 1rem;
  border: 1px solid var(--border); border-radius: 12px; outline: none;
  background: var(--bg-input); color: var(--text-primary);
  transition: border-color 0.2s, box-shadow 0.2s;
}
.input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-subtle); }

.btn {
  padding: 0.9rem 2rem; background: var(--accent); color: #fff; border: none;
  border-radius: 12px; font-size: 1rem; font-weight: 600; cursor: pointer;
  transition: background 0.2s;
}
.btn:hover { background: var(--accent-hover); }

.examples-label { color: var(--text-muted); font-size: 0.85rem; margin-bottom: 0.6rem; }
.chips { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }

.chip {
  padding: 0.5rem 1rem; background: var(--badge-bg); border: 1px solid var(--border);
  border-radius: 8px; color: var(--accent); text-decoration: none;
  font-weight: 600; font-size: 0.85rem; transition: all 0.2s;
}
.chip:hover { background: var(--accent); color: #fff; border-color: var(--accent); transform: translateY(-2px); }

@media (max-width: 520px) {
  .heading { font-size: 1.85rem; }
  .form { flex-direction: column; }
}
</style>
