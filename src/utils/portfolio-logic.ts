import { VisitorLog, ContactMessage } from '../types/portfolio.ts';

/**
 * Validate contact form input
 */
export function validateContactForm(data: {
  name?: string;
  email?: string;
  message?: string;
  consent?: boolean;
  honeypot?: string;
}): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  // Honeypot check for bots
  if (data.honeypot && data.honeypot.trim().length > 0) {
    errors.honeypot = 'Automated submission detected.';
    return { isValid: false, errors };
  }

  // Name validation
  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Full name must be at least 2 characters long.';
  } else if (data.name.trim().length > 80) {
    errors.name = 'Full name cannot exceed 80 characters.';
  }

  // Email format validation (RFC-compliant standard regex)
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!data.email || !emailRegex.test(data.email.trim())) {
    errors.email = 'Please provide a valid email address.';
  }

  // Message validation
  if (!data.message || data.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters long.';
  } else if (data.message.trim().length > 3000) {
    errors.message = 'Message cannot exceed 3000 characters.';
  }

  // Consent checkbox validation
  if (!data.consent) {
    errors.consent = 'You must acknowledge and consent to the data policy to submit.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Sanitize IP address from headers
 */
export function sanitizeIp(rawIp: string | undefined | null): string {
  if (!rawIp) return '127.0.0.1';
  // If comma separated (like X-Forwarded-For: client, proxy1, proxy2)
  const first = rawIp.split(',')[0].trim();
  // Strip IPv6 prefix if mapped IPv4 (e.g. ::ffff:192.168.1.1)
  if (first.startsWith('::ffff:')) {
    return first.substring(7);
  }
  return first;
}

/**
 * Format location into human readable string
 */
export function formatGeoLocation(geo: {
  city?: string;
  region?: string;
  country?: string;
  isp?: string;
}): string {
  const parts: string[] = [];
  if (geo.city) parts.push(geo.city);
  if (geo.region && geo.region !== geo.city) parts.push(geo.region);
  if (geo.country) parts.push(geo.country);
  return parts.length > 0 ? parts.join(', ') : 'Location unavailable (Local/Private)';
}

/**
 * Aggregate visitor analytics stats
 */
export function calculateAnalyticsStats(logs: VisitorLog[]) {
  const totalVisits = logs.length;
  const uniqueIpSet = new Set<string>();
  const countries: Record<string, number> = {};
  const devices: Record<string, number> = {};

  for (const log of logs) {
    if (log.ip) uniqueIpSet.add(log.ip);
    const country = log.country || 'Unknown';
    countries[country] = (countries[country] || 0) + 1;

    const device = log.deviceType || 'Desktop';
    devices[device] = (devices[device] || 0) + 1;
  }

  return {
    totalVisits,
    uniqueIps: uniqueIpSet.size,
    countries,
    devices,
  };
}

/**
 * Generate modern HTML email for visitor notification via Resend
 */
export function generateVisitorEmailHtml(visitor: VisitorLog): string {
  const locationString = formatGeoLocation(visitor);
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #e2e8f0; margin: 0; padding: 24px; }
          .container { max-width: 580px; margin: 0 auto; background: #13192b; border: 1px solid #1e293b; border-radius: 12px; overflow: hidden; }
          .header { background: linear-gradient(135deg, #0284c7, #6366f1); padding: 20px 24px; }
          .header h1 { margin: 0; font-size: 18px; color: #ffffff; letter-spacing: -0.02em; }
          .header p { margin: 4px 0 0 0; font-size: 13px; color: #e0f2fe; }
          .body { padding: 24px; }
          .data-table { width: 100%; border-collapse: collapse; margin-top: 12px; }
          .data-table td { padding: 10px 12px; border-bottom: 1px solid #1e293b; font-size: 13px; }
          .label { color: #94a3b8; width: 35%; font-weight: 500; }
          .value { color: #f8fafc; font-weight: 600; font-family: monospace; }
          .badge { display: inline-block; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; background: #0369a1; color: #e0f2fe; }
          .footer { padding: 16px 24px; background: #0f172a; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #1e293b; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌐 New Portfolio Visitor Alert</h1>
            <p>Jiya-Portfolio • Live Visitor Telemetry</p>
          </div>
          <div class="body">
            <p style="margin: 0 0 16px 0; color: #cbd5e1; font-size: 14px;">Someone just accessed your portfolio website. Here are the detected visitor details:</p>
            <table class="data-table">
              <tr>
                <td class="label">IP Address</td>
                <td class="value"><span class="badge">${visitor.ip}</span></td>
              </tr>
              <tr>
                <td class="label">Location</td>
                <td class="value">${locationString}</td>
              </tr>
              <tr>
                <td class="label">Country / Region</td>
                <td class="value">${visitor.country || 'N/A'} • ${visitor.region || 'N/A'}</td>
              </tr>
              <tr>
                <td class="label">City / Postal</td>
                <td class="value">${visitor.city || 'N/A'} (${visitor.postalCode || 'N/A'})</td>
              </tr>
              <tr>
                <td class="label">ISP / Network</td>
                <td class="value">${visitor.isp || 'N/A'}</td>
              </tr>
              <tr>
                <td class="label">Coordinates</td>
                <td class="value">${visitor.lat && visitor.lon ? `${visitor.lat}, ${visitor.lon}` : 'N/A'}</td>
              </tr>
              <tr>
                <td class="label">Timezone</td>
                <td class="value">${visitor.timezone || 'N/A'}</td>
              </tr>
              <tr>
                <td class="label">Device / Browser</td>
                <td class="value">${visitor.deviceType || 'Desktop'} • ${visitor.browser || 'Browser'}</td>
              </tr>
              <tr>
                <td class="label">Screen & Lang</td>
                <td class="value">${visitor.screenResolution || 'N/A'} • ${visitor.language || 'en'}</td>
              </tr>
              <tr>
                <td class="label">Referrer</td>
                <td class="value" style="word-break: break-all;">${visitor.referrer || 'Direct Visit'}</td>
              </tr>
              <tr>
                <td class="label">Timestamp</td>
                <td class="value">${visitor.timestamp}</td>
              </tr>
            </table>
          </div>
          <div class="footer">
            Automated notification delivered via Resend • Jiya Baghel Portfolio System
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Generate modern HTML email for contact form submission via Resend
 */
export function generateContactEmailHtml(contact: ContactMessage): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #e2e8f0; margin: 0; padding: 24px; }
          .container { max-width: 580px; margin: 0 auto; background: #13192b; border: 1px solid #1e293b; border-radius: 12px; overflow: hidden; }
          .header { background: linear-gradient(135deg, #059669, #0284c7); padding: 20px 24px; }
          .header h1 { margin: 0; font-size: 18px; color: #ffffff; letter-spacing: -0.02em; }
          .header p { margin: 4px 0 0 0; font-size: 13px; color: #d1fae5; }
          .body { padding: 24px; }
          .sender-info { background: #0f172a; border-radius: 8px; padding: 16px; margin-bottom: 20px; border: 1px solid #1e293b; }
          .sender-name { font-size: 16px; font-weight: 700; color: #f8fafc; margin-bottom: 4px; }
          .sender-email { font-size: 14px; color: #38bdf8; }
          .message-box { background: #182238; border-left: 4px solid #38bdf8; padding: 16px; border-radius: 4px; font-size: 14px; line-height: 1.6; color: #f1f5f9; white-space: pre-wrap; }
          .meta { margin-top: 16px; font-size: 12px; color: #64748b; font-family: monospace; }
          .footer { padding: 16px 24px; background: #0f172a; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #1e293b; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📩 New Portfolio Contact Message</h1>
            <p>Jiya-Portfolio • Message from ${contact.name}</p>
          </div>
          <div class="body">
            <div class="sender-info">
              <div class="sender-name">${contact.name}</div>
              <div class="sender-email"><a href="mailto:${contact.email}" style="color: #38bdf8; text-decoration: none;">${contact.email}</a></div>
            </div>
            <div style="font-size: 13px; font-weight: 600; color: #94a3b8; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em;">Message:</div>
            <div class="message-box">${contact.message}</div>
            <div class="meta">
              Submitted at: ${contact.timestamp} • IP: ${contact.ip} • Consent Verified: Yes
            </div>
          </div>
          <div class="footer">
            Reply directly to the sender at ${contact.email} • Sent via Resend
          </div>
        </div>
      </body>
    </html>
  `;
}
