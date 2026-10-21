import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { Resend } from 'resend';
import { portfolioData } from './portfolioData.ts';
import {
  validateContactForm,
  sanitizeIp,
  calculateAnalyticsStats,
  generateVisitorEmailHtml,
  generateContactEmailHtml,
} from '../src/utils/portfolio-logic.ts';
import { VisitorLog, ContactMessage } from '../src/types/portfolio.ts';

dotenv.config();

export const apiRouter = express.Router();
apiRouter.use(express.json());
apiRouter.use(express.urlencoded({ extended: true }));

function isValidAdminPasscode(passcode: string | undefined): boolean {
  if (!passcode) return false;
  const envPasscode = process.env.ADMIN_PASSCODE?.trim();
  return passcode === 'jiya2026' || passcode === 'CSE2026' || (Boolean(envPasscode) && passcode === envPasscode);
}

// Storage directory for persistent analytics logs
const DATA_DIR = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const ANALYTICS_FILE = path.join(DATA_DIR, 'analytics.json');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');
const ENV_FILE = path.resolve(process.cwd(), '.env');

// In-memory caches backed by disk
let visitorLogs: VisitorLog[] = [];
let contactMessages: ContactMessage[] = [];

try {
  if (fs.existsSync(ANALYTICS_FILE)) {
    visitorLogs = JSON.parse(fs.readFileSync(ANALYTICS_FILE, 'utf-8'));
  }
  if (fs.existsSync(MESSAGES_FILE)) {
    contactMessages = JSON.parse(fs.readFileSync(MESSAGES_FILE, 'utf-8'));
  }
} catch (e) {
  console.warn('Could not read existing analytics files, starting fresh:', e);
}

function saveAnalytics() {
  try {
    fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(visitorLogs.slice(-500), null, 2));
  } catch (err) {
    console.error('Failed to persist analytics:', err);
  }
}

function saveMessages() {
  try {
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(contactMessages.slice(-200), null, 2));
  } catch (err) {
    console.error('Failed to persist messages:', err);
  }
}

// Helper to get fresh Resend instance
function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY?.trim() || '';
  if (!apiKey) return null;
  try {
    return new Resend(apiKey);
  } catch {
    return null;
  }
}

const recentNotifiedIps = new Map<string, number>();

/**
 * GET /api/portfolio
 */
apiRouter.get('/portfolio', (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.json(portfolioData);
});

/**
 * POST /api/track-visit
 */
apiRouter.post('/track-visit', async (req: Request, res: Response) => {
  try {
    const rawIp = (req.headers['x-forwarded-for'] as string) ||
                  (req.headers['x-real-ip'] as string) ||
                  req.socket.remoteAddress ||
                  '127.0.0.1';

    const ip = sanitizeIp(rawIp);
    const clientData = req.body || {};

    let geoData: {
      country?: string;
      regionName?: string;
      city?: string;
      zip?: string;
      isp?: string;
      lat?: number;
      lon?: number;
      timezone?: string;
    } = {};

    const isLocal = ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.');
    if (!isLocal) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,regionName,city,zip,lat,lon,timezone,isp`, {
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (geoRes.ok) {
          const parsed = await geoRes.json();
          if (parsed.status === 'success') {
            geoData = parsed;
          }
        }
      } catch {
        // Fallback
      }
    } else {
      geoData = {
        city: 'Local Environment / AI Studio',
        regionName: 'Development',
        country: 'Localhost',
        isp: 'Cloud Runtime',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };
    }

    const now = new Date();
    const formattedTimestamp = now.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'medium',
    }) + ' IST (' + now.toISOString() + ')';

    const logEntry: VisitorLog = {
      id: 'vis_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      ip,
      timestamp: formattedTimestamp,
      country: geoData.country || clientData.country || 'Unknown Country',
      region: geoData.regionName || clientData.region || 'Unknown Region',
      city: geoData.city || clientData.city || 'Unknown City',
      postalCode: geoData.zip || clientData.postalCode || 'N/A',
      isp: geoData.isp || 'N/A',
      lat: geoData.lat,
      lon: geoData.lon,
      timezone: geoData.timezone || clientData.timezone,
      referrer: clientData.referrer || (req.headers['referer'] as string) || 'Direct Visit',
      userAgent: clientData.userAgent || (req.headers['user-agent'] as string) || 'Unknown User Agent',
      deviceType: clientData.deviceType || 'Desktop',
      browser: clientData.browser || 'Modern Browser',
      screenResolution: clientData.screenResolution || 'N/A',
      language: clientData.language || (req.headers['accept-language'] as string)?.split(',')[0] || 'en',
      pagePath: clientData.pagePath || '/',
      emailSent: false,
    };

    const targetEmail = process.env.NOTIFICATION_EMAIL || 'jiyab623@gmail.com';
    const lastNotified = recentNotifiedIps.get(ip) || 0;
    const cooldownMs = 15 * 60 * 1000;
    const shouldSendEmail = Date.now() - lastNotified > cooldownMs;

    const resend = getResendClient();

    if (shouldSendEmail) {
      if (resend) {
        try {
          const emailResult = await resend.emails.send({
            from: 'Jiya Portfolio <onboarding@resend.dev>',
            to: [targetEmail],
            subject: `🌐 New Visitor Alert: ${logEntry.city || 'Visitor'} (${ip}) • Jiya-Portfolio`,
            html: generateVisitorEmailHtml(logEntry),
          });

          if (emailResult.error) {
            logEntry.emailSent = false;
            logEntry.emailError = emailResult.error.message;
            console.warn('[Resend] Email dispatch notice:', emailResult.error.message);
          } else {
            logEntry.emailSent = true;
            recentNotifiedIps.set(ip, Date.now());
            console.log(`[Resend] Successfully delivered visitor telemetry alert to ${targetEmail}`);
          }
        } catch (emailErr: any) {
          logEntry.emailSent = false;
          logEntry.emailError = emailErr?.message || 'Email delivery failed';
        }
      } else {
        logEntry.emailSent = false;
        logEntry.emailError = 'RESEND_API_KEY not configured yet in .env';
      }
    } else {
      logEntry.emailSent = true;
    }

    visitorLogs.unshift(logEntry);
    saveAnalytics();

    res.json({
      success: true,
      logId: logEntry.id,
      emailSent: logEntry.emailSent,
      hasResendKey: Boolean(process.env.RESEND_API_KEY),
    });
  } catch (error: any) {
    console.error('Error tracking visit:', error);
    res.status(500).json({ success: false, message: 'Visit tracking failed' });
  }
});

/**
 * POST /api/contact
 */
apiRouter.post('/contact', async (req: Request, res: Response) => {
  try {
    const rawIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
    const ip = sanitizeIp(rawIp);

    const validation = validateContactForm(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        errors: validation.errors,
      });
    }

    const { name, email, message, consent } = req.body;
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
    const resend = getResendClient();

    if (resend) {
      try {
        const emailResult = await resend.emails.send({
          from: 'Jiya Portfolio <onboarding@resend.dev>',
          to: [targetEmail],
          replyTo: contactEntry.email,
          subject: `📩 New Contact Message from ${contactEntry.name} • Jiya-Portfolio`,
          html: generateContactEmailHtml(contactEntry),
        });

        if (emailResult.error) {
          console.warn('[Resend] Contact email error:', emailResult.error.message);
        } else {
          contactEntry.emailSent = true;
          console.log(`[Resend] Contact message delivered to ${targetEmail}`);
        }
      } catch (err: any) {
        console.warn('Failed to send contact notification email:', err?.message);
      }
    }

    contactMessages.unshift(contactEntry);
    saveMessages();

    res.json({
      success: true,
      message: 'Your message has been received! Jiya will review and get back to you soon.',
      id: contactEntry.id,
      emailSent: contactEntry.emailSent,
    });
  } catch (err: any) {
    console.error('Error handling contact submission:', err);
    res.status(500).json({ success: false, message: 'Failed to process message' });
  }
});

/**
 * POST /api/admin/login
 */
function checkAdminAuth(req: Request): boolean {
  const authHeader = req.headers['authorization'];
  return Boolean(authHeader && authHeader.startsWith('Bearer auth_'));
}

/**
 * POST /api/admin/login
 */
apiRouter.post('/admin/login', (req: Request, res: Response) => {
  const { passcode } = req.body;
  if (isValidAdminPasscode(passcode)) {
    res.json({ success: true, token: 'auth_' + Buffer.from('jiya_authorized_admin').toString('base64') });
  } else {
    res.status(401).json({ success: false, message: 'Invalid admin passcode. Use "jiya2026" or your custom passcode.' });
  }
});

/**
 * GET /api/admin/stats
 */
apiRouter.get('/admin/stats', (req: Request, res: Response) => {
  if (!checkAdminAuth(req)) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const stats = calculateAnalyticsStats(visitorLogs);
  const targetEmail = process.env.NOTIFICATION_EMAIL || 'jiyab623@gmail.com';
  const apiKey = process.env.RESEND_API_KEY?.trim() || '';

  res.json({
    success: true,
    summary: {
      ...stats,
      recentVisits: visitorLogs.slice(0, 50),
      contactMessages: contactMessages.slice(0, 50),
      resendConfigured: Boolean(apiKey),
      targetEmail,
      hasKey: Boolean(apiKey),
      maskedKey: apiKey ? apiKey.substring(0, 5) + '...' + apiKey.slice(-4) : '',
    },
  });
});

/**
 * POST /api/admin/test-email
 */
apiRouter.post('/admin/test-email', async (req: Request, res: Response) => {
  if (!checkAdminAuth(req)) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const resend = getResendClient();
  const targetEmail = process.env.NOTIFICATION_EMAIL || 'jiyab623@gmail.com';

  if (!resend) {
    return res.status(400).json({
      success: false,
      message: 'RESEND_API_KEY is not configured yet. Please configure it in .env or via the Admin Hub.',
    });
  }

  try {
    const result = await resend.emails.send({
      from: 'Jiya Portfolio <onboarding@resend.dev>',
      to: [targetEmail],
      subject: '✅ Resend Test Email • Jiya-Portfolio',
      html: `
        <div style="font-family: sans-serif; background: #0b0f19; color: #fff; padding: 24px; border-radius: 8px;">
          <h2 style="color: #38bdf8;">Resend Email Configuration Verified!</h2>
          <p>Your portfolio visitor notification system is successfully operational with Resend.</p>
          <p>Notifications for new visits and contact messages are routed to: <strong>${targetEmail}</strong>.</p>
          <div style="margin-top: 16px; padding: 12px; background: #13192b; border-radius: 6px; font-size: 13px;">
            Status: Active & Tested • Sent via Resend API
          </div>
          <p style="font-size: 12px; color: #94a3b8; margin-top: 20px;">Jiya Baghel Portfolio System</p>
        </div>
      `,
    });

    if (result.error) {
      return res.status(500).json({ success: false, error: result.error.message });
    }

    res.json({ success: true, message: `Test email sent successfully to ${targetEmail}`, id: result.data?.id });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/admin/save-config
 * Save RESEND_API_KEY and NOTIFICATION_EMAIL from UI
 */
apiRouter.post('/admin/save-config', (req: Request, res: Response) => {
  if (!checkAdminAuth(req)) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const { resendApiKey, notificationEmail } = req.body;
  if (resendApiKey !== undefined) {
    process.env.RESEND_API_KEY = resendApiKey.trim();
  }
  if (notificationEmail) {
    process.env.NOTIFICATION_EMAIL = notificationEmail.trim();
  }

  // Update .env file on disk
  try {
    let envContent = fs.existsSync(ENV_FILE) ? fs.readFileSync(ENV_FILE, 'utf-8') : '';
    const newApiKey = process.env.RESEND_API_KEY || '';
    const newTargetEmail = process.env.NOTIFICATION_EMAIL || 'jiyab623@gmail.com';
    const newPasscode = process.env.ADMIN_PASSCODE || 'jiya2026';

    const updatedEnv = `RESEND_API_KEY="${newApiKey}"\nNOTIFICATION_EMAIL="${newTargetEmail}"\nADMIN_PASSCODE="${newPasscode}"\n`;
    fs.writeFileSync(ENV_FILE, updatedEnv, 'utf-8');
  } catch (err) {
    console.error('Failed to write .env:', err);
  }

  res.json({
    success: true,
    message: 'Configuration saved and activated!',
    resendConfigured: Boolean(process.env.RESEND_API_KEY),
  });
});
