import catalog from './catalog.mjs';
import { nameSource, validLanguage, translateName } from '../lib/product-names.mjs';

export default {
  async fetch(request) {
    const reply = (data, status = 200) => Response.json(data, {
      status, headers:{'Cache-Control':status === 200 ? 'public, max-age=86400, s-maxage=86400' : 'no-store'}
    });
    if (request.method !== 'GET') return reply({error:'Method not allowed'}, 405);
    const url = new URL(request.url), language = url.searchParams.get('lang'), id = Number(url.searchParams.get('id'));
    if (!url.searchParams.has('id') || !Number.isSafeInteger(id) || id < 0 || !validLanguage(language)) return reply({error:'Invalid request'}, 400);
    try {
      // Public catalog only: never translate arbitrary submitted text or inactive products.
      const response = await catalog.fetch(new Request(new URL('/api/catalog', url)));
      if (!response.ok) return reply({error:'Catalog unavailable'}, 503);
      const {products} = await response.json();
      const product = products.find(item => item.id === id && item.active);
      if (!product) return reply({error:'Product not found'}, 404);
      const source = nameSource(product);
      // Version the cache by the actual source, so renaming a product invalidates it.
      if (url.searchParams.get('name') !== source.name || url.searchParams.get('source') !== source.language) return reply({error:'Product changed'}, 409);
      const saved = product.translations?.[language]?.name;
      const name = saved && (language === source.language || saved !== source.name) ? saved : await translateName(source.name, source.language, language);
      return reply({id, language, source:source.name, name});
    } catch { return reply({error:'Translation temporarily unavailable'}, 503); }
  }
};

