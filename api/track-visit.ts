import { Resend } from 'resend';
import {
  sanitizeIp,
  generateVisitorEmailHtml,
} from '../src/utils/portfolio-logic.ts';
import { VisitorLog } from '../src/types/portfolio.ts';

// In-memory debounce for serverless instance lifetime
const recentNotified = new Map<string, number>();

export default async function handler(req: any, res: any) {
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

    // Vercel edge/serverless automatically supplies these headers
    const vercelCity = req.headers['x-vercel-ip-city'] ? decodeURIComponent(req.headers['x-vercel-ip-city'] as string) : undefined;
    const vercelRegion = (req.headers['x-vercel-ip-country-region'] as string) || undefined;
    const vercelCountry = (req.headers['x-vercel-ip-country'] as string) || undefined;
    const vercelTimezone = (req.headers['x-vercel-ip-timezone'] as string) || undefined;
    const vercelLat = req.headers['x-vercel-ip-latitude'] ? parseFloat(req.headers['x-vercel-ip-latitude'] as string) : undefined;
    const vercelLon = req.headers['x-vercel-ip-longitude'] ? parseFloat(req.headers['x-vercel-ip-longitude'] as string) : undefined;

    let city = vercelCity || body.city || 'Unknown City';
    let region = vercelRegion || body.region || 'Unknown Region';
    let country = vercelCountry || body.country || 'Unknown Country';
    let timezone = vercelTimezone || body.timezone || 'Asia/Kolkata';

    // If local or headers empty, fallback to ip-api for public IP
    const isLocal = ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.');
    if (!vercelCity && !isLocal) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1500);
        const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,regionName,city,lat,lon,timezone,isp`, {
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (geoRes.ok) {
          const parsed = await geoRes.json();
          if (parsed.status === 'success') {
            city = parsed.city || city;
            region = parsed.regionName || region;
            country = parsed.country || country;
            timezone = parsed.timezone || timezone;
          }
        }
      } catch {
        // Fallback silently
      }
    }

    const now = new Date();
    const formattedTimestamp = now.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'medium',
    }) + ' IST';

    const logEntry: VisitorLog = {
      id: 'vis_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      ip,
      timestamp: formattedTimestamp,
      country,
      region,
      city,
      timezone,
      lat: vercelLat,
      lon: vercelLon,
      referrer: body.referrer || (req.headers['referer'] as string) || 'Direct Visit',
      userAgent: body.userAgent || (req.headers['user-agent'] as string) || 'Browser',
      deviceType: body.deviceType || 'Desktop',
      browser: body.browser || 'Modern Browser',
      screenResolution: body.screenResolution || 'N/A',
      language: body.language || (req.headers['accept-language'] as string)?.split(',')[0] || 'en',
      pagePath: body.pagePath || '/',
      emailSent: false,
    };

    const targetEmail = process.env.NOTIFICATION_EMAIL || 'jiyab623@gmail.com';
    const apiKey = process.env.RESEND_API_KEY?.trim();

    // 15-minute debounce
    const lastNotified = recentNotified.get(ip) || 0;
    const shouldSend = Date.now() - lastNotified > 15 * 60 * 1000;

    let resendMessage = 'Logged';
    if (shouldSend && apiKey) {
      try {
        const resend = new Resend(apiKey);
        const emailRes = await resend.emails.send({
          from: 'Jiya Portfolio <onboarding@resend.dev>',
          to: [targetEmail],
          subject: `🌐 New Visitor Alert: ${city} (${ip}) • Jiya-Portfolio`,
          html: generateVisitorEmailHtml(logEntry),
        });

        if (emailRes.error) {
          resendMessage = `Resend warning: ${emailRes.error.message}`;
          console.warn('[Vercel Resend]:', emailRes.error.message);
        } else {
          logEntry.emailSent = true;
          recentNotified.set(ip, Date.now());
          resendMessage = 'Sent';
        }
      } catch (err: any) {
        resendMessage = err?.message || 'Email delivery failed';
      }
    } else if (!apiKey) {
      resendMessage = 'RESEND_API_KEY not configured in Vercel environment variables';
    }

    return res.status(200).json({
      success: true,
      logId: logEntry.id,
      emailSent: logEntry.emailSent,
      resendStatus: resendMessage,
      configuredOnVercel: Boolean(apiKey),
    });
  } catch (error: any) {
    console.error('Error tracking visit on Vercel:', error);
    return res.status(200).json({ success: true, message: 'Logged locally' });
  }
}
