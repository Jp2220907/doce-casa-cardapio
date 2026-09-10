const json = (body, status = 200) => Response.json(body, { status });

export default async function login(request) {
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

  return json({ ok: true });
}
