export const useDarkMode = () => {
  const isDark = useState('darkMode', () => false)

  const apply = (val: boolean) => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', val)
    }
  }

  const toggleDarkMode = () => {
    isDark.value = !isDark.value
    apply(isDark.value)
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('darkMode', String(isDark.value))
    }
  }

  const initDarkMode = () => {
    if (typeof localStorage !== 'undefined') {
      isDark.value = localStorage.getItem('darkMode') === 'true'
      apply(isDark.value)
    }
  }

  return { isDark, toggleDarkMode, initDarkMode }
}
