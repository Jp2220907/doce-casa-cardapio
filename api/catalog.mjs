import { createHash } from 'node:crypto';

const json = (body, status = 200) => Response.json(body, { status });
const supabaseUrl = () => (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '');
const supabaseKey = () => process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

function adminToken() {
  const email = process.env.ADMIN_EMAIL || '';
  const password = process.env.ADMIN_PASSWORD || '';
  return createHash('sha256').update(`${email}:${password}:doce-casa-admin`).digest('hex');
}

function isAdmin(request) {
  const cookie = request.headers.get('cookie') || '';
  const match = cookie.match(/(?:^|;\s*)dc_admin=([^;]+)/);
  return match?.[1] === adminToken();
}

async function supabase(path, options = {}) {
  const url = supabaseUrl();
  const key = supabaseKey();
  if (!url || !key) throw new Error('Supabase environment variables are not configured');
  return fetch(`${url}${path}`, { ...options, headers: { apikey: key, Authorization: `Bearer ${key}`, ...options.headers } });
}

async function readCatalog() {
  const [productsResponse, settingsResponse] = await Promise.all([
    supabase('/rest/v1/products?select=*&order=id.asc'),
    supabase('/rest/v1/store_settings?select=*&id=eq.main')
  ]);
  if (!productsResponse.ok || !settingsResponse.ok) throw new Error('Supabase tables are missing or unavailable');
  const products = await productsResponse.json();
  const settingsRows = await settingsResponse.json();
  return { products, settings: settingsRows[0] || { currency: 'BRL', language: 'pt-BR' } };
}

async function writeCatalog(body) {
  if (!Array.isArray(body.products) || !body.settings) return json({ ok: false, error: 'Invalid catalog' }, 400);
  const products = body.products.map(product => ({
    id: Number(product.id),
    name: String(product.name || '').trim(),
    description: String(product.description || '').trim(),
    price: Number(product.price) || 0,
    category: String(product.category || 'Bolos').trim(),
    image: String(product.image || '🍰'),
    active: product.active !== false,
    translations: product.translations && typeof product.translations === 'object' ? product.translations : {}
  })).filter(product => Number.isSafeInteger(product.id) && product.name && product.description);

  const existingResponse = await supabase('/rest/v1/products?select=id');
  if (!existingResponse.ok) throw new Error('Could not read existing products');
  const existing = await existingResponse.json();
  const incomingIds = new Set(products.map(product => product.id));
  for (const product of existing) {
    if (!incomingIds.has(Number(product.id))) {
      const removeResponse = await supabase(`/rest/v1/products?id=eq.${encodeURIComponent(product.id)}`, { method: 'DELETE' });
      if (!removeResponse.ok) throw new Error('Could not remove a product');
    }
  }

  if (products.length) {
    const productsResponse = await supabase('/rest/v1/products?on_conflict=id', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify(products)
    });
    if (!productsResponse.ok) throw new Error('Could not save products');
  }

  const settingsResponse = await supabase('/rest/v1/store_settings?on_conflict=id', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify([{ id: 'main', currency: String(body.settings.currency || 'BRL'), language: String(body.settings.language || 'pt-BR') }])
  });
  if (!settingsResponse.ok) throw new Error('Could not save settings');
  return json({ ok: true });
}

async function catalog(request) {
  try {
    if (request.method === 'GET') return json(await readCatalog());
    if (request.method !== 'PUT') return json({ ok: false, error: 'Method not allowed' }, 405);
    if (!isAdmin(request)) return json({ ok: false, error: 'Unauthorized' }, 401);
    return await writeCatalog(await request.json());
  } catch (error) {
    console.error(error);
    return json({ ok: false, error: 'Supabase is not configured. Check the tables and environment variables.' }, 500);
  }
}

export default { fetch: catalog };
