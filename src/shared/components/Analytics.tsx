import { init } from '@plausible-analytics/tracker'

function Analytics() {
  // Don't load analytics in development mode
  if (!import.meta.env.PROD) {
    return null
  }
  // Don't load analytics if base domain is not set
  if (!import.meta.env.VITE_BASE_DOMAIN) {
    return null
  }
  // Don't load analytics in standalone mode (e.g. PWA)
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return null
  }
  init({
    domain: import.meta.env.VITE_BASE_DOMAIN,
  })
}
export default Analytics
