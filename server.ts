import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { Resend } from 'resend';
import { portfolioData } from './server/portfolioData.ts';
import {
  validateContactForm,
  sanitizeIp,
  calculateAnalyticsStats,
  generateVisitorEmailHtml,
  generateContactEmailHtml,
} from './src/utils/portfolio-logic.ts';
import { VisitorLog, ContactMessage } from './src/types/portfolio.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'jiyab623@gmail.com';
const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || 'jiya2026';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Storage directory for persistent analytics logs
const DATA_DIR = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const ANALYTICS_FILE = path.join(DATA_DIR, 'analytics.json');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');

// In-memory caches backed by disk
let visitorLogs: VisitorLog[] = [];
let contactMessages: ContactMessage[] = [];

// Load existing data if available
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

// Persist helpers
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

// Resend client initialization
const resendApiKey = process.env.RESEND_API_KEY || '';
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Track recently notified IPs to avoid spamming the inbox on multiple rapid page reloads (15-min debounce)
const recentNotifiedIps = new Map<string, number>();

// --- API ENDPOINTS ---

/**
 * GET /api/portfolio
 * Serves portfolio configuration data dynamically to the frontend
 */
app.get('/api/portfolio', (_req: Request, res: Response) => {
  res.json(portfolioData);
});

/**
 * POST /api/track-visit
 * Records visitor details and dispatches Resend notification to jiyab623@gmail.com
 */
app.post('/api/track-visit', async (req: Request, res: Response) => {
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

    // Only lookup public IPs
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
        // Fallback or timeout silently
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

    // Check debounce for Resend email (send at most once every 15 minutes per IP)
    const lastNotified = recentNotifiedIps.get(ip) || 0;
    const cooldownMs = 15 * 60 * 1000;
    const shouldSendEmail = Date.now() - lastNotified > cooldownMs;

    if (shouldSendEmail) {
      if (resend) {
        try {
          const emailResult = await resend.emails.send({
            from: 'Jiya Portfolio <onboarding@resend.dev>',
            to: [NOTIFICATION_EMAIL],
            subject: `🌐 New Visitor Alert: ${logEntry.city || 'Visitor'} (${ip}) • Jiya-Portfolio`,
            html: generateVisitorEmailHtml(logEntry),
          });

          if (emailResult.error) {
            logEntry.emailSent = false;
            logEntry.emailError = emailResult.error.message;
            console.warn('Resend email API returned error:', emailResult.error);
          } else {
            logEntry.emailSent = true;
            recentNotifiedIps.set(ip, Date.now());
            console.log(`[Resend] Visitor notification email sent to ${NOTIFICATION_EMAIL} for IP ${ip}`);
          }
        } catch (emailErr: any) {
          logEntry.emailSent = false;
          logEntry.emailError = emailErr?.message || 'Email delivery failed';
          console.warn('Failed to send Resend email:', emailErr?.message);
        }
      } else {
        logEntry.emailSent = false;
        logEntry.emailError = 'RESEND_API_KEY not configured in environment.';
      }
    } else {
      logEntry.emailSent = true; // Counted under active debounced session
    }

    visitorLogs.unshift(logEntry);
    saveAnalytics();

    res.json({
      success: true,
      logId: logEntry.id,
      emailSent: logEntry.emailSent,
      hasResendKey: Boolean(resendApiKey),
    });
  } catch (error: any) {
    console.error('Error tracking visit:', error);
    res.status(500).json({ success: false, message: 'Visit tracking failed' });
  }
});

/**
 * POST /api/contact
 * Handles contact submissions, validates inputs, and sends Resend notification
 */
app.post('/api/contact', async (req: Request, res: Response) => {
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

    if (resend) {
      try {
        const emailResult = await resend.emails.send({
          from: 'Jiya Portfolio <onboarding@resend.dev>',
          to: [NOTIFICATION_EMAIL],
          replyTo: contactEntry.email,
          subject: `📩 New Contact Message from ${contactEntry.name} • Jiya-Portfolio`,
          html: generateContactEmailHtml(contactEntry),
        });

        if (emailResult.error) {
          console.warn('Resend contact email error:', emailResult.error);
        } else {
          contactEntry.emailSent = true;
          console.log(`[Resend] Contact message from ${contactEntry.name} sent to ${NOTIFICATION_EMAIL}`);
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
 * Verify admin passcode to access analytics
 */
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { passcode } = req.body;
  if (passcode === ADMIN_PASSCODE) {
    res.json({ success: true, token: 'auth_' + Buffer.from(passcode).toString('base64') });
  } else {
    res.status(401).json({ success: false, message: 'Invalid admin passcode' });
  }
});

/**
 * GET /api/admin/stats
 * Protected analytics dashboard data
 */
app.get('/api/admin/stats', (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'];
  const expectedToken = 'Bearer auth_' + Buffer.from(ADMIN_PASSCODE).toString('base64');

  if (authHeader !== expectedToken) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const stats = calculateAnalyticsStats(visitorLogs);
  res.json({
    success: true,
    summary: {
      ...stats,
      recentVisits: visitorLogs.slice(0, 50),
      contactMessages: contactMessages.slice(0, 50),
      resendConfigured: Boolean(resendApiKey),
      targetEmail: NOTIFICATION_EMAIL,
    },
  });
});

/**
 * POST /api/admin/test-email
 * Protected trigger to test Resend email delivery
 */
app.post('/api/admin/test-email', async (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'];
  const expectedToken = 'Bearer auth_' + Buffer.from(ADMIN_PASSCODE).toString('base64');

  if (authHeader !== expectedToken) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  if (!resend) {
    return res.status(400).json({
      success: false,
      message: 'Resend API key is not configured in .env (RESEND_API_KEY).',
    });
  }

  try {
    const result = await resend.emails.send({
      from: 'Jiya Portfolio <onboarding@resend.dev>',
      to: [NOTIFICATION_EMAIL],
      subject: '✅ Resend Test Email • Jiya-Portfolio',
      html: `
        <div style="font-family: sans-serif; background: #0b0f19; color: #fff; padding: 24px; border-radius: 8px;">
          <h2 style="color: #38bdf8;">Resend Email Configuration Verified!</h2>
          <p>Your portfolio visitor notification system is successfully configured with Resend.</p>
          <p>Notifications for new visits and contact messages will be sent to <strong>${NOTIFICATION_EMAIL}</strong>.</p>
          <p style="font-size: 12px; color: #94a3b8;">Sent from Jiya-Portfolio Admin Panel</p>
        </div>
      `,
    });

    if (result.error) {
      return res.status(500).json({ success: false, error: result.error.message });
    }

    res.json({ success: true, message: `Test email sent to ${NOTIFICATION_EMAIL}`, id: result.data?.id });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🚀 Jiya-Portfolio server listening on port ${PORT}`);
    console.log(`📧 Target notification email: ${NOTIFICATION_EMAIL}`);
    console.log(`🔑 Resend status: ${resend ? 'Configured' : 'Missing RESEND_API_KEY (will log visits locally)'}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
