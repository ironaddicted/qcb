# Lead and SEO deployment

`npm run build` now builds the browser application, creates an SSR bundle in the ignored `.prerender` directory, and prerenders the homepage and cost estimator into `dist`. Serve the complete `dist` directory. The existing server script `/home/ubuntu/qcb_deployment.sh` performs this build and copies the result to `/var/www/qcb`.

The initial HTML contains the same page content that React hydrates, plus page-specific titles, descriptions, canonical URLs, and service/organization JSON-LD. `public/robots.txt` and `public/sitemap.xml` are copied by Vite. The estimator remains interactive and lazy-loaded. API keys must stay in a server backend; the previous unused client-side Gemini key definition was removed.

The hero's 30-square-foot ceramic running-bond example is computed from `estimatorPricing.ts`; no separate marketing price is hard-coded. It is an allowance-based planning example, not a binding quote.

Optional timing and project notes are submitted in `message` alongside the existing contact fields. Campaign parameters persist only for the browser session and travel with inquiry notes; they are not sent as Analytics form content. Confirm that the Lambda/email pipeline forwards these fields. Unit and browser tests mock the endpoint and do not prove real email delivery.

Live budget and ad-group changes are documented in the separate ads audit. No automated CRM, offline conversion upload, or AI chatbot is included in this website release.
