# File: config/server.js (nel tuo progetto Strapi)

module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: env('PUBLIC_URL', 'https://api.brix-ia.com'),
  proxy: env.bool('IS_PROXIED', true), // Se usi nginx/reverse proxy
  app: {
    keys: env.array('APP_KEYS'),
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
});