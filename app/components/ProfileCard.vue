<template>
  <div class="card">
    <div class="card-inner">
      <img :src="user.avatar_url" :alt="user.login" class="avatar" />
      <div class="info">
        <h1 class="name">{{ user.name || user.login }}</h1>
        <p class="username">@{{ user.login }}</p>
        <p v-if="user.bio" class="bio">{{ user.bio }}</p>

        <div class="stats-row">
          <div class="stat">
            <span class="stat-num">{{ user.public_repos }}</span>
            <span class="stat-lbl">Repos</span>
          </div>
          <div class="stat">
            <span class="stat-num">{{ fmt(user.followers) }}</span>
            <span class="stat-lbl">Followers</span>
          </div>
          <div class="stat">
            <span class="stat-num">{{ fmt(user.following) }}</span>
            <span class="stat-lbl">Following</span>
          </div>
        </div>

        <div class="meta">
          <span v-if="user.company" class="meta-item">🏢 {{ user.company }}</span>
          <span v-if="user.location" class="meta-item">📍 {{ user.location }}</span>
          <a v-if="user.blog" :href="fmtUrl(user.blog)" target="_blank" rel="noopener" class="meta-link">
            🔗 {{ user.blog }}
          </a>
        </div>

        <a :href="user.html_url" target="_blank" rel="noopener" class="gh-btn">
          View on GitHub →
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ user: { type: Object, required: true } })
const fmt = (n) => (n >= 1000 ? (n / 1000).toFixed(1) + 'k' : n)
const fmtUrl = (u) => (u.startsWith('http') ? u : 'https://' + u)
</script>

<style scoped>
.card {
  background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px;
  padding: 2rem; margin-bottom: 1.5rem; box-shadow: var(--shadow-sm);
  transition: background 0.3s, border-color 0.3s;
}

.card-inner { display: flex; gap: 2rem; align-items: flex-start; }

.avatar {
  width: 140px; height: 140px; border-radius: 50%;
  border: 3px solid var(--accent); flex-shrink: 0;
  transition: transform 0.25s;
}
.avatar:hover { transform: scale(1.05); }

.info { flex: 1; min-width: 0; }

.name { font-size: 2rem; font-weight: 700; color: var(--text-primary); letter-spacing: -0.5px; margin-bottom: 0.15rem; }
.username { font-size: 1.1rem; color: var(--text-muted); margin-bottom: 0.75rem; }
.bio { color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.25rem; }

.stats-row {
  display: flex; gap: 2rem; margin-bottom: 1.25rem; padding: 1rem 0;
  border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
}

.stat { display: flex; flex-direction: column; gap: 0.15rem; }
.stat-num { font-size: 1.5rem; font-weight: 700; color: var(--accent); }
.stat-lbl { font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; font-weight: 500; }

.meta { display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.25rem; }
.meta-item { color: var(--text-secondary); font-size: 0.9rem; }
.meta-link { color: var(--accent); text-decoration: none; font-size: 0.9rem; }
.meta-link:hover { text-decoration: underline; }

.gh-btn {
  display: inline-block; padding: 0.7rem 1.5rem; background: var(--accent);
  color: #fff; text-decoration: none; border-radius: 10px; font-weight: 600;
  font-size: 0.9rem; transition: background 0.2s, transform 0.15s;
}
.gh-btn:hover { background: var(--accent-hover); transform: translateY(-1px); }

@media (max-width: 640px) {
  .card-inner { flex-direction: column; align-items: center; text-align: center; }
  .avatar { width: 110px; height: 110px; }
  .stats-row { justify-content: center; }
  .meta { justify-content: center; }
}
</style>
