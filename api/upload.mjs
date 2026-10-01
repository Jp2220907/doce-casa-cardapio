import { createHmac, timingSafeEqual, randomUUID } from 'node:crypto';

const json = (body, status = 200) => Response.json(body, { status });
const supabaseUrl = () => (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '');
const supabaseKey = () => process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

function isAdmin(request) {
  const key = supabaseKey();
  if (!key) return false;
  const token = (request.headers.get('cookie') || '').match(/(?:^|;\s*)dc_admin=([^;]+)/)?.[1] || '';
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

function validImage(bytes, type) {
  if (type === 'image/jpeg') return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (type === 'image/png') return bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  if (type === 'image/webp') return bytes.subarray(0, 4).toString() === 'RIFF' && bytes.subarray(8, 12).toString() === 'WEBP';
  return false;
}

async function upload(request) {
  try { if (request.headers.get('origin') !== new URL(request.url).origin) return json({ ok: false, error: 'Invalid request origin' }, 403); } catch { return json({ ok: false, error: 'Invalid request origin' }, 403); }
  if (!isAdmin(request)) return json({ ok: false, error: 'Unauthorized' }, 401);
  const url = supabaseUrl();
  const key = supabaseKey();
  if (!url || !key) return json({ ok: false, error: 'Supabase is not configured' }, 500);
  if (request.method === 'DELETE') {
    try {
      const body = await request.json();
      if (!Array.isArray(body.images) || body.images.length > 10) return json({ ok: false, error: 'Invalid image list' }, 400);
      const paths = new Set();
      for (const image of body.images) {
        try {
          const imageUrl = new URL(String(image));
          if (imageUrl.origin !== new URL(url).origin) continue;
          const encoded = imageUrl.pathname.split('/storage/v1/object/public/product-images/')[1];
          const path = encoded ? decodeURIComponent(encoded) : '';
          if (/^products\/[A-Za-z0-9._-]+$/.test(path)) paths.add(path);
        } catch {}
      }
      if (!paths.size) return json({ ok: true, removed: 0 });
      const rows = await fetch(`${url}/rest/v1/products?select=image`, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
      if (!rows.ok) return json({ ok: false, error: 'Could not verify image references' }, 502);
      const used = new Set((await rows.json()).map(row => row.image));
      const urls = new Set(body.images.map(String));
      const removable = [...paths].filter(path => {
        const publicUrl = `${url}/storage/v1/object/public/product-images/${path.split('/').map(encodeURIComponent).join('/')}`;
        return urls.has(publicUrl) && !used.has(publicUrl);
      });
      if (removable.length) {
        const response = await fetch(`${url}/storage/v1/object/product-images`, {
          method: 'DELETE',
          headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ prefixes: removable })
        });
        if (!response.ok) return json({ ok: false, error: 'Could not remove unused images' }, 502);
      }
      return json({ ok: true, removed: removable.length });
    } catch (error) {
      console.error(error);
      return json({ ok: false, error: 'Could not remove unused images' }, 500);
    }
  }
  if (request.method !== 'POST') return json({ ok: false, error: 'Method not allowed' }, 405);
  if (Number(request.headers.get('content-length') || 0) > 5.5 * 1024 * 1024) return json({ ok: false, error: 'Image exceeds the 5 MB limit' }, 413);

  try {
    const form = await request.formData();
    const file = form.get('image');
    if (!file || typeof file.arrayBuffer !== 'function') return json({ ok: false, error: 'Invalid image' }, 400);
    if (file.size < 1 || file.size > 5 * 1024 * 1024) return json({ ok: false, error: 'Image exceeds the 5 MB limit' }, 413);
    const type = String(file.type || '').toLowerCase();
    const extensions = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
    if (!extensions[type]) return json({ ok: false, error: 'Use a JPEG, PNG or WebP image' }, 415);
    const bytes = Buffer.from(await file.arrayBuffer());
    if (!validImage(bytes, type)) return json({ ok: false, error: 'Image file content does not match its type' }, 400);
    const path = `products/${randomUUID()}.${extensions[type]}`;
    const encodedPath = path.split('/').map(encodeURIComponent).join('/');
    const response = await fetch(`${url}/storage/v1/object/product-images/${encodedPath}`, {
      method: 'POST',
      headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': type, 'cache-control': '31536000' },
      body: bytes
    });
    if (!response.ok) {
      console.error('Supabase Storage upload failed:', response.status, await response.text());
      return json({ ok: false, error: 'Could not upload image. Check the product-images bucket.' }, 502);
    }
    return json({ ok: true, url: `${url}/storage/v1/object/public/product-images/${encodedPath}` });
  } catch (error) {
    console.error(error);
    return json({ ok: false, error: 'Could not upload image' }, 500);
  }
}

export default { fetch: upload };
