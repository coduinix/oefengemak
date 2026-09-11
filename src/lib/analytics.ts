declare global {
  interface Window {
    gtag?: (command: 'event', action: string, params?: Record<string, unknown>) => void
  }
}

// Swap point for a privacy-friendly analytics provider later.
export function trackEvent(category: string, action: string, label: string): void {
  window.gtag?.('event', action, { event_category: category, event_label: label })
}
