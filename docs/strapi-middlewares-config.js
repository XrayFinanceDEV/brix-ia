# File: config/middlewares.js (nel tuo progetto Strapi)

module.exports = [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', 'https://api.brix-ia.com'],
          'media-src': ["'self'", 'data:', 'blob:', 'https://api.brix-ia.com'],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      headers: '*',
      origin: [
        'http://localhost:1337',
        'http://localhost:4321', 
        'http://localhost:4322',
        'https://brix-ia.com',
        'https://www.brix-ia.com',
        'https://api.brix-ia.com',
        'https://il-tuo-sito.netlify.app', // Sostituisci con il tuo URL Netlify
      ]
    }
  },
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
