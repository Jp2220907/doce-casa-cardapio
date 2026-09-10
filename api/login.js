module.exports = function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const { email, password } = req.body || {};
  const expectedEmail = process.env.ADMIN_EMAIL;
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedEmail || !expectedPassword) {
    return res.status(500).json({ ok: false, error: 'Admin credentials are not configured' });
  }

  if (email !== expectedEmail || password !== expectedPassword) {
    return res.status(401).json({ ok: false, error: 'Invalid credentials' });
  }

  return res.status(200).json({ ok: true });
};
