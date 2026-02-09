<template>
  <div class="wrap">
    <div class="list-head">
      <h2 class="title">Repositories</h2>
      <div class="controls">
        <input v-model="q" type="text" placeholder="Search repos…" class="input" />
        <select v-model="sort" class="select">
          <option value="updated">Recently Updated</option>
          <option value="stars">Most Stars</option>
          <option value="forks">Most Forks</option>
          <option value="name">Name</option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="status">Loading repositories…</div>

    <div v-else-if="filtered.length" class="repos">
      <div v-for="repo in filtered" :key="repo.id" class="repo">
        <div class="repo-top">
          <a :href="repo.html_url" target="_blank" rel="noopener" class="repo-name">{{ repo.name }}</a>
          <span :class="['badge', repo.private ? 'priv' : 'pub']">{{ repo.private ? 'Private' : 'Public' }}</span>
        </div>
        <p v-if="repo.description" class="desc">{{ repo.description }}</p>
        <div class="meta">
          <span v-if="repo.language" class="meta-item">
            <span class="lang-dot" :style="{ background: langColor(repo.language) }"></span>
            {{ repo.language }}
          </span>
          <span v-if="repo.stargazers_count" class="meta-item">⭐ {{ repo.stargazers_count }}</span>
          <span v-if="repo.forks_count" class="meta-item">🔱 {{ repo.forks_count }}</span>
          <span class="meta-item">📅 {{ ago(repo.updated_at) }}</span>
        </div>
      </div>
    </div>

    <div v-else class="status">{{ q ? `No repos match "${q}"` : 'No public repositories found.' }}</div>
  </div>
</template>

<script setup>
const props = defineProps({
  repos: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false }
})

const q = ref('')
const sort = ref('updated')

const filtered = computed(() => {
  if (!props.repos) return []
  let list = props.repos.filter(r => {
    const s = q.value.toLowerCase()
    return r.name.toLowerCase().includes(s) || (r.description || '').toLowerCase().includes(s) || (r.language || '').toLowerCase().includes(s)
  })
  list.sort((a, b) => {
    if (sort.value === 'stars') return b.stargazers_count - a.stargazers_count
    if (sort.value === 'forks') return b.forks_count - a.forks_count
    if (sort.value === 'name') return a.name.localeCompare(b.name)
    return new Date(b.updated_at) - new Date(a.updated_at)
  })
  return list
})

const ago = (d) => {
  const days = Math.floor((Date.now() - new Date(d)) / 864e5)
  if (days === 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  if (days < 365) return `${Math.floor(days / 30)}mo ago`
  return `${Math.floor(days / 365)}y ago`
}

const langColor = (l) => ({
  JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5',
  Java: '#b07219', Go: '#00ADD8', Rust: '#dea584', Ruby: '#701516',
  PHP: '#4F5D95', C: '#555555', 'C++': '#f34b7d', 'C#': '#178600',
  Swift: '#F05138', Kotlin: '#A97BFF', Vue: '#41b883', HTML: '#e34c26', CSS: '#563d7c'
}[l] || '#8b8b8b')
</script>

<style scoped>
.wrap {
  background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px;
  padding: 1.75rem; box-shadow: var(--shadow-sm); transition: background 0.3s, border-color 0.3s;
}

.list-head { margin-bottom: 1.25rem; }
.title { font-size: 1.2rem; font-weight: 700; color: var(--text-primary); margin-bottom: 1rem; }

.controls { display: flex; gap: 0.5rem; flex-wrap: wrap; }

.input, .select {
  padding: 0.6rem 1rem; border: 1px solid var(--border); border-radius: 10px;
  font-size: 0.9rem; outline: none; background: var(--bg-input); color: var(--text-primary);
  transition: border-color 0.2s;
}
.input:focus, .select:focus { border-color: var(--accent); }
.input { flex: 1; min-width: 180px; }
.select { cursor: pointer; }

.status { text-align: center; padding: 2rem; color: var(--text-muted); }

.repos { display: flex; flex-direction: column; gap: 0.75rem; }

.repo {
  padding: 1.25rem; border: 1px solid var(--border); border-radius: 12px;
  background: var(--bg-card-nested);
  transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
}
.repo:hover { border-color: var(--border-hover); box-shadow: var(--shadow-md); transform: translateY(-2px); }

.repo-top { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.5rem; }

.repo-name { font-weight: 700; font-size: 1.05rem; color: var(--accent); text-decoration: none; }
.repo-name:hover { text-decoration: underline; }

.badge {
  font-size: 0.65rem; font-weight: 600; padding: 0.2rem 0.55rem;
  border-radius: 6px; text-transform: uppercase; letter-spacing: 0.3px;
}
.badge.pub { background: var(--badge-bg); color: var(--badge-text); }
.badge.priv { background: #fef3c7; color: #92400e; }

.desc { color: var(--text-secondary); font-size: 0.9rem; line-height: 1.5; margin-bottom: 0.75rem; }

.meta { display: flex; flex-wrap: wrap; gap: 1rem; font-size: 0.825rem; color: var(--text-muted); }
.meta-item { display: flex; align-items: center; gap: 0.3rem; }
.lang-dot { width: 10px; height: 10px; border-radius: 50%; }

@media (max-width: 640px) {
  .wrap { padding: 1.25rem; }
  .controls { flex-direction: column; }
  .input { min-width: 100%; }
}
</style>
