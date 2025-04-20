function Analytics() {
  // Don't load analytics in standalone mode (e.g. PWA)
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return null
  }
  // Don't load analytics in development mode
  if (!import.meta.env.PROD) {
    return null
  }
  return (
    <script
      async
      data-domain="pictrider.takeyaqa.dev"
      src="https://plausible.io/js/script.js"
    ></script>
  )
}
export default Analytics
