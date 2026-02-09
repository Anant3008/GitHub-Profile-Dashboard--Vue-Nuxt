<template>
  <div class="profile-page">
    <div class="container">
      <div v-if="pending" class="loading">
        <div class="spinner"></div>
        <p>Loading profile…</p>
      </div>

      <div v-else-if="error" class="error-box">
        <h2 v-if="error.statusCode === 403">🚫 Rate Limit Exceeded</h2>
        <h2 v-else>😕 User Not Found</h2>
        <p v-if="error.statusCode === 403">GitHub API rate limit reached. Try again in a few minutes.</p>
        <p v-else>The username "{{ username }}" doesn't exist on GitHub.</p>
        <NuxtLink to="/" class="back-btn">← Back to Search</NuxtLink>
      </div>

      <div v-else-if="profileData">
        <NuxtLink to="/" class="back-link">← Search another user</NuxtLink>
        <ProfileCard :user="profileData" />
        <StatsGrid :user="profileData" :repos="reposData" />
        <LanguageChart :repos="reposData" />
        <RepoList :repos="reposData" :loading="reposPending" />
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const username = route.params.username

const { data: profileData, pending, error } = await useFetch(
  `https://api.github.com/users/${username}`
)

const { data: reposData, pending: reposPending } = await useFetch(
  `https://api.github.com/users/${username}/repos`,
  { query: { sort: 'updated', per_page: 100 } }
)

useHead({
  title: profileData.value
    ? `${profileData.value.name || profileData.value.login} — GitHub Dashboard`
    : 'GitHub Profile Dashboard'
})
</script>

<style scoped>
.container { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; }

.loading { text-align: center; padding: 4rem 0; }
.loading p { color: var(--text-muted); font-size: 1.1rem; margin-top: 1rem; }

.spinner {
  width: 48px; height: 48px;
  border: 4px solid var(--border); border-top-color: var(--accent);
  border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto;
}
@keyframes spin { to { transform: rotate(360deg); } }

.error-box {
  text-align: center; padding: 3rem 2rem; margin: 2rem 0;
  background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px;
}
.error-box h2 { color: #ef4444; font-size: 1.75rem; margin-bottom: 0.75rem; }
.error-box p { color: var(--text-secondary); margin-bottom: 1.5rem; }

.back-btn {
  display: inline-block; padding: 0.7rem 1.5rem; background: var(--accent);
  color: #fff; text-decoration: none; border-radius: 10px; font-weight: 600;
  transition: background 0.2s;
}
.back-btn:hover { background: var(--accent-hover); }

.back-link {
  display: inline-block; margin-bottom: 1.5rem; padding: 0.4rem 0.8rem;
  color: var(--accent); text-decoration: none; font-weight: 600; font-size: 0.9rem;
  border-radius: 8px; transition: background 0.2s;
}
.back-link:hover { background: var(--accent-subtle); }
</style>
