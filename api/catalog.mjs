import { createHmac, timingSafeEqual, randomUUID } from 'node:crypto';

const json = (body, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store, max-age=0' } });
const supabaseUrl = () => (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '');
const supabaseKey = () => process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

function isAdmin(request) {
  const key = supabaseKey();
  if (!key) return false;
  const cookie = request.headers.get('cookie') || '';
  const token = cookie.match(/(?:^|;\s*)dc_admin=([^;]+)/)?.[1] || '';
  const [payload, signature, extra] = token.split('.');
  if (!payload || !signature || extra) return false;
  const expected = createHmac('sha256', key).update(payload).digest();
  let actual;
  try { actual = Buffer.from(signature, 'base64url'); } catch { return false; }
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return false;
  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return session.email === process.env.ADMIN_EMAIL && Number(session.exp) > Date.now() / 1000;
  } catch { return false; }
}

function sameOrigin(request) {
  try { return request.headers.get('origin') === new URL(request.url).origin; } catch { return false; }
}

async function supabase(path, options = {}) {
  const url = supabaseUrl();
  const key = supabaseKey();
  if (!url || !key) throw new Error('Supabase environment variables are not configured');
  return fetch(`${url}${path}`, { ...options, headers: { apikey: key, Authorization: `Bearer ${key}`, ...options.headers } });
}

function storagePath(image) {
  try {
    const url = new URL(image);
    const base = new URL(supabaseUrl());
    if (url.origin !== base.origin) return null;
    const encoded = url.pathname.split('/storage/v1/object/public/product-images/')[1];
    if (!encoded) return null;
    const path = decodeURIComponent(encoded);
    return /^products\/[A-Za-z0-9._-]+$/.test(path) ? path : null;
  } catch { return null; }
}

function imageBuffer(image) {
  const match = /^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$/i.exec(String(image || ''));
  if (!match) return null;
  const bytes = Buffer.from(match[2], 'base64');
  if (!bytes.length || bytes.length > 5 * 1024 * 1024) return null;
  const valid = match[1] === 'jpeg'
    ? bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
    : match[1] === 'png'
      ? bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
      : bytes.subarray(0, 4).toString() === 'RIFF' && bytes.subarray(8, 12).toString() === 'WEBP';
  return valid ? { bytes, type: `image/${match[1]}`, ext: match[1] === 'jpeg' ? 'jpg' : match[1] } : null;
}

async function uploadImage(bytes, type, path) {
  const key = supabaseKey();
  const encoded = path.split('/').map(encodeURIComponent).join('/');
  const response = await fetch(`${supabaseUrl()}/storage/v1/object/product-images/${encoded}`, {
    method: 'POST',
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': type, 'x-upsert': 'true', 'cache-control': '31536000' },
    body: bytes
  });
  if (!response.ok) throw new Error('Could not save an image in Supabase Storage');
  return `${supabaseUrl()}/storage/v1/object/public/product-images/${encoded}`;
}

async function migrateLegacyImages(products) {
  const migrated = [];
  for (const product of products) {
    const image = imageBuffer(product.image);
    if (!image) { migrated.push(product); continue; }
    try {
      const url = await uploadImage(image.bytes, image.type, `products/${randomUUID()}.${image.ext}`);
      const response = await supabase(`/rest/v1/products?id=eq.${encodeURIComponent(product.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify({ image: url, updated_at: new Date().toISOString() })
      });
      if (!response.ok) throw new Error('Could not update the product image reference');
      migrated.push({ ...product, image: url });
    } catch (error) {
      console.error('Legacy product image migration failed:', error);
      migrated.push(product);
    }
  }
  return migrated;
}

async function readCatalog(request) {
  const requestedAdmin = new URL(request.url).searchParams.get('admin') === '1';
  const admin = isAdmin(request);
  if (requestedAdmin && !admin) return json({ ok: false, error: 'Unauthorized' }, 401);
  const [productsResponse, settingsResponse] = await Promise.all([
    supabase(`/rest/v1/products?select=*&${admin ? '' : 'active=eq.true&'}order=id.asc`),
    supabase('/rest/v1/store_settings?select=*&id=eq.main')
  ]);
  if (!productsResponse.ok || !settingsResponse.ok) throw new Error('Supabase tables are missing or unavailable');
  let products = await productsResponse.json();
  if (admin) products = await migrateLegacyImages(products);
  const settingsRows = await settingsResponse.json();
  return { products, settings: settingsRows[0] || { currency: 'BRL', language: 'pt-BR' } };
}

async function removeUnusedImages(previousProducts, products) {
  const current = await supabase('/rest/v1/products?select=image');
  if (!current.ok) throw new Error('Catalog saved, but old image cleanup could not be checked');
  const currentImages = new Set((await current.json()).map(row => row.image));
  const nextImages = new Set(products.map(product => product.image));
  const paths = new Set();
  for (const product of previousProducts) {
    if (!nextImages.has(product.image) && !currentImages.has(product.image)) {
      const path = storagePath(product.image);
      if (path) paths.add(path);
    }
  }
  if (!paths.size) return;
  const response = await fetch(`${supabaseUrl()}/storage/v1/object/product-images`, {
    method: 'DELETE',
    headers: { apikey: supabaseKey(), Authorization: `Bearer ${supabaseKey()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ prefixes: [...paths] })
  });
  if (!response.ok) console.error('Could not remove unused product images from Storage');
}

async function writeCatalog(body) {
  if (!body || !Array.isArray(body.products) || !body.settings || typeof body.settings !== 'object') return json({ ok: false, error: 'Invalid catalog' }, 400);
  if (body.products.length > 500) return json({ ok: false, error: 'Catalog has too many products' }, 400);
  const products = body.products.map(product => ({
    id: Number(product.id),
    name: String(product.name || '').trim().slice(0, 160),
    description: String(product.description || '').trim().slice(0, 2000),
    price: Number(product.price),
    category: String(product.category || 'Bolos').trim().slice(0, 100),
    image: String(product.image || '🍰').slice(0, 8 * 1024 * 1024),
    active: product.active !== false,
    translations: product.translations && typeof product.translations === 'object' && !Array.isArray(product.translations) ? product.translations : {}
  }));
  if (products.some(product => !Number.isSafeInteger(product.id) || product.id < 0 || !product.name || !product.description || !Number.isFinite(product.price) || product.price < 0)) {
    return json({ ok: false, error: 'One or more products have invalid fields' }, 400);
  }
  if (new Set(products.map(product => product.id)).size !== products.length) return json({ ok: false, error: 'Duplicate product IDs' }, 400);

  const existingResponse = await supabase('/rest/v1/products?select=id,image');
  if (!existingResponse.ok) throw new Error('Could not read existing products');
  const previousProducts = await existingResponse.json();
  const saveResponse = await supabase('/rest/v1/rpc/save_catalog', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ p_products: products, p_settings: {
      currency: String(body.settings.currency || 'BRL').slice(0, 3),
      language: String(body.settings.language || 'pt-BR').slice(0, 16)
    } })
  });
  if (!saveResponse.ok) {
    console.error('Catalog transaction failed:', saveResponse.status, await saveResponse.text());
    throw new Error('Could not save catalog');
  }
  await removeUnusedImages(previousProducts, products);
  return json({ ok: true, products, settings: body.settings });
}

async function catalog(request) {
  try {
    if (request.method === 'GET') return json(await readCatalog(request));
    if (request.method !== 'PUT') return json({ ok: false, error: 'Method not allowed' }, 405);
    if (!sameOrigin(request) || !isAdmin(request)) return json({ ok: false, error: 'Unauthorized' }, 401);
    const length = Number(request.headers.get('content-length') || 0);
    if (length > 10 * 1024 * 1024) return json({ ok: false, error: 'Catalog request is too large' }, 413);
    return await writeCatalog(await request.json());
  } catch (error) {
    console.error(error);
    return json({ ok: false, error: 'Could not load or save the catalog. Check Supabase configuration and migrations.' }, 500);
  }
}

export default { fetch: catalog };
