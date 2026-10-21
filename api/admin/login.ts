export default function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const { passcode } = body;

    const envPasscode = process.env.ADMIN_PASSCODE?.trim();
    const isValid = passcode === 'jiya2026' || passcode === 'CSE2026' || (Boolean(envPasscode) && passcode === envPasscode);

    if (isValid) {
      return res.status(200).json({
        success: true,
        token: 'auth_' + Buffer.from('jiya_authorized_admin').toString('base64'),
      });
    } else {
      return res.status(401).json({
        success: false,
        message: 'Invalid passcode. Default is "jiya2026"',
      });
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Authentication error' });
  }
}
