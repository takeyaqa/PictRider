import { init } from '@plausible-analytics/tracker'

// Only load analytics in production mode and when base domain is set
if (import.meta.env.PROD && import.meta.env.VITE_BASE_DOMAIN) {
  // Don't load analytics in standalone mode (e.g. PWA)
  if (!window.matchMedia('(display-mode: standalone)').matches) {
    init({
      domain: import.meta.env.VITE_BASE_DOMAIN,
    })
  }
}
