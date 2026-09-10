function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

module.exports = async function login(req, res) {
  try {
    if (req.method !== 'POST') {
      return send(res, 405, { ok: false, error: 'Method not allowed' });
    }

    let body = req.body || {};
    if (typeof body === 'string') body = JSON.parse(body || '{}');

    const expectedEmail = process.env.ADMIN_EMAIL;
    const expectedPassword = process.env.ADMIN_PASSWORD;

    if (!expectedEmail || !expectedPassword) {
      return send(res, 500, {
        ok: false,
        error: 'Configure ADMIN_EMAIL and ADMIN_PASSWORD in Vercel Environment Variables'
      });
    }

    if (body.email !== expectedEmail || body.password !== expectedPassword) {
      return send(res, 401, { ok: false, error: 'Invalid credentials' });
    }

    return send(res, 200, { ok: true });
  } catch (error) {
    console.error('Login function failed:', error);
    return send(res, 400, { ok: false, error: 'Invalid request body' });
  }
};
