import { readFile, readdir, writeFile } from 'node:fs/promises';
import { render } from '../.prerender/prerender.js';

const pages = [
  { path: '/', file: 'dist/index.html', title: 'Backsplash Installation in Charlotte, NC | Queen City Backsplash', description: 'Kitchen tile backsplash installation in Charlotte and surrounding communities. See real projects, explore planning costs, and request a free personal quote.' },
  { path: '/cost-estimator/', file: 'dist/cost-estimator/index.html', title: 'Backsplash Cost Estimator in Charlotte | Queen City Backsplash', description: 'Plan your Charlotte-area backsplash budget by tile, pattern, wall size, and preparation. Separate installation labor from material allowances, then request a personal quote.' },
];
for (const page of pages) {
  let html = await readFile(page.file, 'utf8');
  html = html.replace('<div id="root"></div>', `<div id="root">${render(page.path)}</div>`)
    .replace(/<title>.*?<\/title>/s, `<title>${page.title}</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${page.description}" />`)
    .replace('</head>', `<link rel="canonical" href="https://queencitybacksplash.com${page.path}" />\n</head>`);
  const schema = {
    '@context': 'https://schema.org', '@type': 'Service',
    name: 'Kitchen backsplash installation', serviceType: 'Tile backsplash installation',
    areaServed: { '@type': 'City', name: 'Charlotte' },
    provider: { '@type': 'Organization', '@id': 'https://queencitybacksplash.com/#organization', name: 'Queen City Backsplash', url: 'https://queencitybacksplash.com/', telephone: '+17047509110', parentOrganization: { '@type': 'Organization', name: 'VAD Constructions', url: 'https://vadconstructions.com/' } },
  };
  html = html.replace('</head>', `<script type="application/ld+json">${JSON.stringify(schema)}</script>\n</head>`);
  if (page.path === '/cost-estimator/') {
    const css = (await readdir('dist/assets')).find(file => /^CostEstimator-.*\.css$/.test(file));
    if (!css) throw new Error('Missing estimator stylesheet');
    html = html.replace('</head>', `<link rel="stylesheet" href="/assets/${css}" />\n</head>`);
  }
  if (!html.includes('<h1') || !html.includes('rel="canonical"')) throw new Error(`Incomplete rendered page: ${page.file}`);
  await writeFile(page.file, html);
}
console.log('Prerendered homepage and cost estimator with canonical URLs and service metadata.');
