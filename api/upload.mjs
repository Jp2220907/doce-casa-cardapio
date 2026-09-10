import { createHash } from 'node:crypto';

const json = (body, status = 200) => Response.json(body, { status });
const supabaseUrl = () => (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '');
const supabaseKey = () => process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const adminToken = () => createHash('sha256').update(`${process.env.ADMIN_EMAIL || ''}:${process.env.ADMIN_PASSWORD || ''}:doce-casa-admin`).digest('hex');

function isAdmin(request) {
  const cookie = request.headers.get('cookie') || '';
  const match = cookie.match(/(?:^|;\s*)dc_admin=([^;]+)/);
  return match?.[1] === adminToken();
}

async function upload(request) {
  if (request.method !== 'POST') return json({ ok: false, error: 'Method not allowed' }, 405);
  if (!isAdmin(request)) return json({ ok: false, error: 'Unauthorized' }, 401);
  const url = supabaseUrl();
  const key = supabaseKey();
  if (!url || !key) return json({ ok: false, error: 'Supabase is not configured' }, 500);

  try {
    const form = await request.formData();
    const file = form.get('image');
    if (!file || typeof file.arrayBuffer !== 'function' || !String(file.type || '').startsWith('image/')) return json({ ok: false, error: 'Invalid image' }, 400);
    const extension = String(file.type).split('/')[1].replace(/[^a-z0-9]/gi, '') || 'jpg';
    const pathname = `products/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;
    const encodedPath = pathname.split('/').map(encodeURIComponent).join('/');
    const response = await fetch(`${url}/storage/v1/object/product-images/${encodedPath}`, {
      method: 'POST',
      headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': file.type, 'x-upsert': 'true', 'cache-control': '31536000' },
      body: await file.arrayBuffer()
    });
    if (!response.ok) return json({ ok: false, error: 'Could not upload image. Check the product-images bucket.' }, 500);
    return json({ ok: true, url: `${url}/storage/v1/object/public/product-images/${encodedPath}` });
  } catch (error) {
    console.error(error);
    return json({ ok: false, error: 'Could not upload image' }, 500);
  }
}

export default { fetch: upload };
