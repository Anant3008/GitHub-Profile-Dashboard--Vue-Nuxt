<template>
  <div class="grid">
    <div v-for="s in items" :key="s.label" class="cell">
      <span class="cell-icon">{{ s.icon }}</span>
      <div class="cell-body">
        <span class="cell-val">{{ s.value }}</span>
        <span class="cell-lbl">{{ s.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  user: { type: Object, required: true },
  repos: { type: Array, default: () => [] }
})

const totalStars = computed(() => props.repos?.reduce((s, r) => s + r.stargazers_count, 0) ?? 0)
const totalForks = computed(() => props.repos?.reduce((s, r) => s + r.forks_count, 0) ?? 0)
const avgStars = computed(() => props.repos?.length ? Math.round(totalStars.value / props.repos.length) : 0)
const accountAge = computed(() => {
  const ms = Date.now() - new Date(props.user.created_at).getTime()
  const y = Math.floor(ms / 3.156e10); if (y > 0) return `${y}y`
  const m = Math.floor(ms / 2.628e9); if (m > 0) return `${m}mo`
  return `${Math.floor(ms / 8.64e7)}d`
})

const items = computed(() => [
  { icon: '⭐', value: totalStars.value, label: 'Total Stars' },
  { icon: '🔱', value: totalForks.value, label: 'Total Forks' },
  { icon: '📦', value: props.user.public_repos, label: 'Public Repos' },
  { icon: '📝', value: props.user.public_gists || 0, label: 'Gists' },
  { icon: '📅', value: accountAge.value, label: 'Account Age' },
  { icon: '🏆', value: avgStars.value, label: 'Avg Stars/Repo' }
])
</script>

<style scoped>
.grid {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(155px, 1fr));
  gap: 1rem; margin-bottom: 1.5rem;
}

.cell {
  background: var(--bg-card); border: 1px solid var(--border); border-radius: 14px;
  padding: 1.25rem; display: flex; align-items: center; gap: 0.85rem;
  transition: background 0.3s, border-color 0.3s, transform 0.2s, box-shadow 0.2s;
}
.cell:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); border-color: var(--border-hover); }

.cell-icon { font-size: 1.75rem; line-height: 1; }
.cell-body { display: flex; flex-direction: column; }
.cell-val { font-size: 1.5rem; font-weight: 700; color: var(--accent); line-height: 1.2; }
.cell-lbl { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.4px; font-weight: 500; margin-top: 0.15rem; }

@media (max-width: 480px) { .grid { grid-template-columns: repeat(2, 1fr); } }
</style>
