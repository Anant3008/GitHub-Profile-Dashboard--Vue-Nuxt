<template>
  <div class="chart-card">
    <h3 class="title">Language Distribution</h3>

    <div v-if="langs.length">
      <!-- Stacked bar overview -->
      <div class="stacked-bar">
        <div
          v-for="l in langs" :key="'bar-' + l.name"
          class="stacked-segment"
          :style="{ width: l.pct + '%', background: l.color }"
          :title="`${l.name}: ${l.pct}%`"
        ></div>
      </div>

      <!-- Detailed rows -->
      <div class="rows">
        <div v-for="(l, i) in langs" :key="l.name" class="row">
          <div class="row-left">
            <span class="dot" :style="{ background: l.color }"></span>
            <span class="lang-name">{{ l.name }}</span>
          </div>
          <div class="row-right">
            <span class="lang-count">{{ l.count }} {{ l.count === 1 ? 'repo' : 'repos' }}</span>
            <div class="mini-bar">
              <div class="mini-fill" :style="{ width: l.pct + '%', background: l.color }"></div>
            </div>
            <span class="lang-pct">{{ l.pct }}%</span>
          </div>
        </div>
      </div>
    </div>

    <p v-else class="empty">No language data available</p>
  </div>
</template>

<script setup>
const props = defineProps({ repos: { type: Array, default: () => [] } })

const langColors = {
  JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5',
  Java: '#b07219', Go: '#00ADD8', Rust: '#dea584', Ruby: '#701516',
  PHP: '#4F5D95', C: '#555555', 'C++': '#f34b7d', 'C#': '#178600',
  Swift: '#F05138', Kotlin: '#A97BFF', Vue: '#41b883', HTML: '#e34c26',
  CSS: '#563d7c', Shell: '#89e051', Dart: '#00B4AB', Lua: '#000080',
  Perl: '#0298c3', Scala: '#c22d40', Haskell: '#5e5086', Elixir: '#6e4a7e',
  R: '#198CE7', MATLAB: '#e16737', Jupyter: '#F37626'
}

const langs = computed(() => {
  if (!props.repos?.length) return []
  const map = {}
  props.repos.forEach(r => { if (r.language) map[r.language] = (map[r.language] || 0) + 1 })
  const total = Object.values(map).reduce((a, b) => a + b, 0)
  return Object.entries(map)
    .map(([name, count]) => ({
      name, count,
      pct: ((count / total) * 100).toFixed(1),
      color: langColors[name] || '#8b8b8b'
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)
})
</script>

<style scoped>
.chart-card {
  background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px;
  padding: 1.75rem; margin-bottom: 1.5rem; box-shadow: var(--shadow-sm);
  transition: background 0.3s, border-color 0.3s;
}

.title { font-size: 1.2rem; font-weight: 700; color: var(--text-primary); margin-bottom: 1.25rem; }

/* ── Stacked bar ── */
.stacked-bar {
  display: flex; height: 14px; border-radius: 10px; overflow: hidden;
  margin-bottom: 1.5rem; background: var(--track-bg);
}

.stacked-segment {
  transition: width 0.6s ease;
  position: relative;
}
.stacked-segment:first-child { border-radius: 10px 0 0 10px; }
.stacked-segment:last-child { border-radius: 0 10px 10px 0; }
.stacked-segment:only-child { border-radius: 10px; }

/* ── Rows ── */
.rows { display: flex; flex-direction: column; gap: 0.65rem; }

.row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 0.6rem 0.85rem; border-radius: 10px; background: var(--bg-card-nested);
  border: 1px solid var(--border); transition: border-color 0.2s, transform 0.15s;
}
.row:hover { border-color: var(--border-hover); transform: translateX(4px); }

.row-left { display: flex; align-items: center; gap: 0.5rem; }

.dot { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }

.lang-name { font-weight: 600; font-size: 0.9rem; color: var(--text-primary); }

.row-right { display: flex; align-items: center; gap: 0.75rem; }

.lang-count { font-size: 0.78rem; color: var(--text-muted); white-space: nowrap; }

.mini-bar { width: 80px; height: 6px; border-radius: 6px; background: var(--track-bg); overflow: hidden; }
.mini-fill { height: 100%; border-radius: 6px; transition: width 0.6s ease; }

.lang-pct { font-size: 0.85rem; font-weight: 600; color: var(--text-primary); min-width: 42px; text-align: right; }

.empty { text-align: center; padding: 1.5rem; color: var(--text-muted); }

@media (max-width: 500px) {
  .mini-bar { display: none; }
  .lang-count { display: none; }
}
</style>
