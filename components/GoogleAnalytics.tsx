'use client';

import { useEffect } from 'react';

export const GA_DELAY_MS = 3000;

const INTERACTION_EVENTS = [
  'pointerdown',
  'keydown',
  'scroll',
  'touchstart',
] as const;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let injected = false;

function injectGtag(gaId: string) {
  if (injected) return;
  injected = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // gtag очікує саме обʼєкт arguments, як в офіційному сніпеті Google
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', gaId);

  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  script.async = true;
  document.head.appendChild(script);
}

const GoogleAnalytics = ({ ga_id }: { ga_id?: string }) => {
  useEffect(() => {
    if (!ga_id) return;

    let done = false;
    const load = () => {
      if (done) return;
      done = true;
      cleanup();
      injectGtag(ga_id);
    };
    const timer = window.setTimeout(load, GA_DELAY_MS);
    INTERACTION_EVENTS.forEach(event =>
      window.addEventListener(event, load, { once: true, passive: true })
    );

    function cleanup() {
      window.clearTimeout(timer);
      INTERACTION_EVENTS.forEach(event =>
        window.removeEventListener(event, load)
      );
    }

    return cleanup;
  }, [ga_id]);

  return null;
};

export default GoogleAnalytics;
