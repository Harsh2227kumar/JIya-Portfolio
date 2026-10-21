import { Resend } from 'resend';
import {
  validateContactForm,
  sanitizeIp,
  generateContactEmailHtml,
} from '../src/utils/portfolio-logic.ts';
import { ContactMessage } from '../src/types/portfolio.ts';

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const rawIp = (req.headers['x-forwarded-for'] as string) ||
                  (req.headers['x-real-ip'] as string) ||
                  req.socket?.remoteAddress ||
                  '127.0.0.1';
    const ip = sanitizeIp(rawIp);

    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};

    const validation = validateContactForm(body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        errors: validation.errors,
      });
    }

    const { name, email, message, consent } = body;
    const now = new Date();
    const formattedTimestamp = now.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'medium',
    }) + ' IST';

    const contactEntry: ContactMessage = {
      id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      timestamp: formattedTimestamp,
      ip,
      consentGiven: Boolean(consent),
      emailSent: false,
    };

    const targetEmail = process.env.NOTIFICATION_EMAIL || 'jiyab623@gmail.com';
    const apiKey = process.env.RESEND_API_KEY?.trim();

    let emailError: string | null = null;

    if (apiKey) {
      try {
        const resend = new Resend(apiKey);
        const emailResult = await resend.emails.send({
          from: 'Jiya Portfolio <onboarding@resend.dev>',
          to: [targetEmail],
          replyTo: contactEntry.email,
          subject: `📩 New Contact Message from ${contactEntry.name} • Jiya-Portfolio`,
          html: generateContactEmailHtml(contactEntry),
        });

        if (emailResult.error) {
          emailError = emailResult.error.message;
          console.warn('[Vercel Resend Error]:', emailResult.error.message);
        } else {
          contactEntry.emailSent = true;
          console.log(`[Vercel Resend] Message sent to ${targetEmail}`);
        }
      } catch (err: any) {
        emailError = err?.message || 'Email delivery failed';
        console.warn('[Vercel Resend Exception]:', err?.message);
      }
    } else {
      emailError = 'RESEND_API_KEY is not configured in Vercel Environment Variables';
    }

    return res.status(200).json({
      success: true,
      message: contactEntry.emailSent
        ? 'Your message has been sent successfully to Jiya Baghel!'
        : 'Your message was recorded! Note: RESEND_API_KEY must be configured in Vercel Environment Variables to dispatch live emails.',
      id: contactEntry.id,
      emailSent: contactEntry.emailSent,
      emailError,
      hasResendKey: Boolean(apiKey),
    });
  } catch (err: any) {
    console.error('Error in contact serverless handler:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to process message: ' + (err?.message || 'Server error'),
    });
  }
}
