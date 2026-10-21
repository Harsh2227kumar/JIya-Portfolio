import { Resend } from 'resend';

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer auth_')) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const targetEmail = process.env.NOTIFICATION_EMAIL || 'jiyab623@gmail.com';

  if (!apiKey) {
    return res.status(400).json({
      success: false,
      message: 'RESEND_API_KEY is not configured in Vercel Environment Variables.',
    });
  }

  try {
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from: 'Jiya Portfolio <onboarding@resend.dev>',
      to: [targetEmail],
      subject: '✅ Resend Test Email • Jiya-Portfolio (Vercel)',
      html: `
        <div style="font-family: sans-serif; background: #0b0f19; color: #fff; padding: 24px; border-radius: 8px;">
          <h2 style="color: #38bdf8;">Resend Operational on Vercel!</h2>
          <p>Your portfolio notification system is successfully configured and sending from Vercel.</p>
          <p>Target Inbox: <strong>${targetEmail}</strong></p>
        </div>
      `,
    });

    if (result.error) {
      return res.status(500).json({ success: false, error: result.error.message });
    }

    return res.status(200).json({
      success: true,
      message: `Test email sent successfully to ${targetEmail}`,
      id: result.data?.id,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || 'Delivery error' });
  }
}
