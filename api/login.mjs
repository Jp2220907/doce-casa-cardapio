import { createHash } from 'node:crypto';

const json = (body, status = 200) => Response.json(body, { status });

async function login(request) {
  if (request.method !== 'POST') {
    return json({ ok: false, error: 'Method not allowed' }, 405);
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

  if (body.email !== expectedEmail || body.password !== expectedPassword) {
    return json({ ok: false, error: 'Invalid credentials' }, 401);
  }

  const token = createHash('sha256').update(`${expectedEmail}:${expectedPassword}:doce-casa-admin`).digest('hex');
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : '';
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Set-Cookie': `dc_admin=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800${secure}`
    }
  });
}

export default { fetch: login };
