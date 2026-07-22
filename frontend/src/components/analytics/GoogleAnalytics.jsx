import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { COOKIE_CONSENT_EVENT, hasFunctionalConsent } from '../../lib/cookieConsent';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

function initGtag(gaId) {
  if (!gaId || typeof window === 'undefined' || window.__GA_INITIALIZED__) {
    return false;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', gaId, { send_page_view: false });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  document.head.appendChild(script);

  window.__GA_INITIALIZED__ = true;
  return true;
}

function trackPageView(gaId, pathname, search) {
  if (!gaId || typeof window.gtag !== 'function') return;
  window.gtag('config', gaId, {
    page_path: `${pathname}${search}`,
  });
}

export default function GoogleAnalytics() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    if (!GA_ID) return undefined;

    const maybeInit = () => {
      if (!hasFunctionalConsent()) return;
      initGtag(GA_ID);
      trackPageView(GA_ID, pathname, search);
    };

    maybeInit();
    window.addEventListener(COOKIE_CONSENT_EVENT, maybeInit);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, maybeInit);
  }, [pathname, search]);

  return null;
}
