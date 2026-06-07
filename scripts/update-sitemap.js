import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sitemapPath = resolve(__dirname, '../public/sitemap.xml');
const today = new Date().toISOString().split('T')[0];
const sitemap = readFileSync(sitemapPath, 'utf8');
const updated = sitemap.replace(/<lastmod>.*?<\/lastmod>/g, `<lastmod>${today}</lastmod>`);
writeFileSync(sitemapPath, updated);
console.log(`sitemap.xml lastmod → ${today}`);
