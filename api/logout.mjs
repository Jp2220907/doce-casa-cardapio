const json = (body, status = 200) => Response.json(body, { status });

function sameOrigin(request) {
  try { return request.headers.get('origin') === new URL(request.url).origin; } catch { return false; }
}

async function logout(request) {
  if (request.method !== 'POST') return json({ ok: false, error: 'Method not allowed' }, 405);
  if (!sameOrigin(request)) return json({ ok: false, error: 'Invalid request origin' }, 403);
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : '';
  return new Response(JSON.stringify({ ok: true }), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Set-Cookie': `dc_admin=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure}`
    }
  });
}

export default { fetch: logout };
