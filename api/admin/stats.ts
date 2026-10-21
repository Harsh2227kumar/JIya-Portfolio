export default function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');

  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer auth_')) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const apiKey = process.env.RESEND_API_KEY?.trim() || '';
  const targetEmail = process.env.NOTIFICATION_EMAIL || 'jiyab623@gmail.com';

  return res.status(200).json({
    success: true,
    summary: {
      totalVisits: 1,
      uniqueIps: 1,
      countries: { Global: 1 },
      devices: { Web: 1 },
      recentVisits: [],
      contactMessages: [],
      resendConfigured: Boolean(apiKey),
      targetEmail,
      hasKey: Boolean(apiKey),
      maskedKey: apiKey ? apiKey.substring(0, 5) + '...' + apiKey.slice(-4) : '',
    },
  });
}
