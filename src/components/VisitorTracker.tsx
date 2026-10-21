import { useEffect } from 'react';

export const VisitorTracker = () => {
  useEffect(() => {
    // Check if session has already been logged to avoid spamming on internal component updates
    const sessionKey = 'jiya_portfolio_visit_logged';
    if (sessionStorage.getItem(sessionKey)) {
      return;
    }

    const reportVisit = async () => {
      try {
        const payload = {
          referrer: document.referrer || 'Direct Visit',
          userAgent: navigator.userAgent,
          language: navigator.language,
          screenResolution: `${window.screen.width}x${window.screen.height}`,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          pagePath: window.location.pathname + window.location.search,
          deviceType: /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop',
          browser: getBrowserName(navigator.userAgent),
        };

        const res = await fetch('/api/track-visit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          sessionStorage.setItem(sessionKey, 'true');
        }
      } catch (err) {
        console.warn('Analytics ping:', err);
      }
    };

    reportVisit();
  }, []);

  return null;
};

function getBrowserName(ua: string): string {
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Edg')) return 'Edge';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari')) return 'Safari';
  return 'Browser';
}
