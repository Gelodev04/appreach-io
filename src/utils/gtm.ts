// Simple delay utility
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const isGTMLoaded = (): boolean => {
  if (typeof window === 'undefined') return false;

  return !!(
    window.dataLayer &&
    window.dataLayer.length > 0 &&
    (window.gtag ||
      window.google_tag_manager ||
      document.querySelector('script[src*="gtm.js"]') ||
      document.querySelector('script[src*="outreachmagic.io"]'))
  );
};

export const pushGTMEvent = async (eventName: string): Promise<void> => {
  if (typeof window === 'undefined') {
    console.warn('GTM: Window is undefined');
    return;
  }

  // Ensure dataLayer exists
  window.dataLayer = window.dataLayer || [];

  const pushEvent = () => {
    const eventObject = { event: eventName };
    window.dataLayer?.push(eventObject);
    console.log('GTM event pushed:', eventObject);
  };

  // If GTM is already loaded, push immediately
  if (isGTMLoaded()) {
    pushEvent();
    return;
  }

  // Wait for GTM to load, with fallback timeout
  let attempts = 0;
  const maxAttempts = 20; // 10 seconds max wait

  const checkAndPush = async (): Promise<void> => {
    attempts++;
    if (isGTMLoaded()) {
      pushEvent();
      return;
    }

    if (attempts < maxAttempts) {
      await delay(500);
      await checkAndPush();
    } else {
      // Fallback: push anyway after timeout
      console.warn('GTM not detected after timeout, pushing event anyway');
      pushEvent();
    }
  };

  // Wait a bit then start checking
  await delay(100);
  await checkAndPush();
};
