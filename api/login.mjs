import { createHmac, timingSafeEqual } from 'node:crypto';

const json = (body, status = 200) => Response.json(body, { status });
const supabaseUrl = () => (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '');
const supabaseKey = () => process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

function sameOrigin(request) {
  try { return request.headers.get('origin') === new URL(request.url).origin; } catch { return false; }
}

function safeEqual(left, right) {
  const a = Buffer.from(String(left || ''));
  const b = Buffer.from(String(right || ''));
  return a.length === b.length && timingSafeEqual(a, b);
}

function ipHash(request, key) {
  const ip = request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for')?.split(',').at(-1)?.trim() || 'unknown';
  return createHmac('sha256', key).update(ip).digest('hex');
}

async function loginLimit(key, hash, reset = false) {
  const response = await fetch(`${supabaseUrl()}/rest/v1/rpc/${reset ? 'reset_admin_login_limit' : 'check_admin_login_limit'}`, {
    method: 'POST',
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ p_ip_hash: hash })
  });
  if (!response.ok) throw new Error('Login rate-limit storage is unavailable');
  return reset ? true : response.json();
}

function createSession(email, key) {
  const payload = Buffer.from(JSON.stringify({ email, exp: Math.floor(Date.now() / 1000) + 28800 })).toString('base64url');
  const signature = createHmac('sha256', key).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

async function login(request) {
  if (request.method !== 'POST') {
    return json({ ok: false, error: 'Method not allowed' }, 405);
  }
  if (!sameOrigin(request)) return json({ ok: false, error: 'Invalid request origin' }, 403);
  if (Number(request.headers.get('content-length') || 0) > 8192) return json({ ok: false, error: 'Request is too large' }, 413);

  const key = supabaseKey();
  const url = supabaseUrl();
  if (!key || !url) return json({ ok: false, error: 'Supabase is not configured' }, 500);
  const hash = ipHash(request, key);
  try {
    if (!await loginLimit(key, hash)) return json({ ok: false, error: 'Too many attempts. Try again in 15 minutes.' }, 429);
  } catch (error) {
    console.error(error);
    return json({ ok: false, error: 'Login protection is temporarily unavailable.' }, 503);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'Invalid request body' }, 400);
  }

  const expectedEmail = process.env.ADMIN_EMAIL;
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedEmail || !expectedPassword) {
    return json({
      ok: false,
      error: 'Configure ADMIN_EMAIL and ADMIN_PASSWORD in Vercel Environment Variables'
    }, 500);
  }

  if (!safeEqual(body.email, expectedEmail) || !safeEqual(body.password, expectedPassword)) {
    return json({ ok: false, error: 'Invalid credentials' }, 401);
  }

  try { await loginLimit(key, hash, true); } catch (error) {
    console.error(error);
    return json({ ok: false, error: 'Could not complete secure login.' }, 503);
  }
  const token = createSession(expectedEmail, key);
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : '';
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Set-Cookie': `dc_admin=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=28800${secure}`
    }
  });
}

export default { fetch: login };
