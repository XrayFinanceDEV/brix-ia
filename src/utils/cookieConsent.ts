// Dichiara la proprietà gtag per evitare errori di tipo
declare global {
    interface Window {
      gtag?: (...args: any[]) => void;
    }
  }
  export {};
  
  /**
   * Restituisce l'elemento del banner dei cookie.
   */
  export function getCookieBanner(): HTMLElement | null {
    return document.getElementById('cookie-banner');
  }
  
  /**
   * Imposta il consenso e nasconde il banner.
   * Se il consenso è positivo, carica anche gli script di tracciamento.
   */
  export function setCookieConsent(consent: boolean): void {
    localStorage.setItem('cookieConsent', consent ? 'granted' : 'denied');
    const banner = getCookieBanner();
    if (banner) {
      banner.style.display = 'none';
    }
  
    if (consent) {
      if (window.gtag) {
        window.gtag('consent', 'update', {
          'ad_storage': 'granted',
          'analytics_storage': 'granted'
        });
      }
      loadTrackingScripts();
    } else {
      if (window.gtag) {
        window.gtag('consent', 'update', {
          'ad_storage': 'denied',
          'analytics_storage': 'denied'
        });
      }
    }
  }
  
  /**
   * Carica gli script di tracciamento (Google Tag Manager e Facebook Pixel).
   */
  export function loadTrackingScripts(): void {
    // Google Tag Manager / gtag.js
    const gtagScript = document.createElement('script');
    gtagScript.async = true;
    gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-RG8QTCEDPX';
    document.head.appendChild(gtagScript);
  
    // Inizializzazione di gtag
    const inlineScript = document.createElement('script');
    inlineScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-RG8QTCEDPX');
    `;
    document.head.appendChild(inlineScript);
  
    // Facebook Pixel
    const fbScript = document.createElement('script');
    fbScript.innerHTML = `!function(f,b,e,v,n,t,s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments) };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = true; n.version = '2.0';
      n.queue = []; t = b.createElement(e); t.async = true;
      t.src = 'https://connect.facebook.net/en_US/fbevents.js';
      s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, 'script'); fbq('init', 'FB-PIXEL-ID'); fbq('track', 'PageView');`;
    document.head.appendChild(fbScript);
  }
  
  
  /**
   * Verifica il valore del consenso salvato in localStorage e agisce di conseguenza:
   * - Se è "granted": carica gli script e nasconde il banner.
   * - Se è "denied": nasconde il banner.
   * - Se non esiste (null): mostra il banner.
   */
  export function checkConsent(): void {
    const consent = localStorage.getItem('cookieConsent');
    const banner = getCookieBanner();
    if (consent === 'granted') {
      if (window.gtag) {
        window.gtag('consent', 'update', {
          'ad_storage': 'granted',
          'analytics_storage': 'granted'
        });
      }
      loadTrackingScripts();
      if (banner) {
        banner.style.display = 'none';
      }
    } else if (consent === 'denied') {
      if (banner) {
        banner.style.display = 'none';
      }
    } else {
      // Nessun consenso salvato: mostra il banner.
      if (banner) {
        banner.style.display = 'block';
      }
    }
  }
  