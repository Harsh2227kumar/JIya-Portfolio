import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateContactForm,
  sanitizeIp,
  formatGeoLocation,
  calculateAnalyticsStats,
  generateVisitorEmailHtml,
} from './portfolio-logic.ts';
import { VisitorLog } from '../types/portfolio.ts';

test('validateContactForm passes valid contact input', () => {
  const result = validateContactForm({
    name: 'Sarah Connor',
    email: 'sarah@example.com',
    message: 'Hello Jiya, I love your AI/ML projects and would love to connect!',
    consent: true,
  });

  assert.equal(result.isValid, true);
  assert.equal(Object.keys(result.errors).length, 0);
});

test('validateContactForm rejects invalid email and missing consent', () => {
  const result = validateContactForm({
    name: 'A',
    email: 'invalid-email-format',
    message: 'Too short',
    consent: false,
  });

  assert.equal(result.isValid, false);
  assert.ok(result.errors.name);
  assert.ok(result.errors.email);
  assert.ok(result.errors.message);
  assert.ok(result.errors.consent);
});

test('validateContactForm blocks bot honeypot submission', () => {
  const result = validateContactForm({
    name: 'Spam Bot',
    email: 'bot@spam.com',
    message: 'Click here for free bitcoin right now!',
    consent: true,
    honeypot: 'http://spam-link.xyz',
  });

  assert.equal(result.isValid, false);
  assert.equal(result.errors.honeypot, 'Automated submission detected.');
});

test('sanitizeIp correctly strips prefixes and extracts first forwarded IP', () => {
  assert.equal(sanitizeIp('203.0.113.195, 70.41.3.18, 150.172.238.178'), '203.0.113.195');
  assert.equal(sanitizeIp('::ffff:192.168.1.50'), '192.168.1.50');
  assert.equal(sanitizeIp(undefined), '127.0.0.1');
  assert.equal(sanitizeIp(''), '127.0.0.1');
});

test('formatGeoLocation handles full and partial location data', () => {
  assert.equal(
    formatGeoLocation({ city: 'Nagpur', region: 'Maharashtra', country: 'India' }),
    'Nagpur, Maharashtra, India'
  );
  assert.equal(
    formatGeoLocation({ country: 'India' }),
    'India'
  );
  assert.equal(
    formatGeoLocation({}),
    'Location unavailable (Local/Private)'
  );
});

test('calculateAnalyticsStats correctly aggregates unique visitors, countries and devices', () => {
  const sampleLogs: VisitorLog[] = [
    {
      id: '1',
      ip: '103.21.244.2',
      timestamp: '2026-10-21T02:00:00Z',
      country: 'India',
      deviceType: 'Desktop',
      emailSent: true,
    },
    {
      id: '2',
      ip: '103.21.244.2', // Duplicate IP
      timestamp: '2026-10-21T02:05:00Z',
      country: 'India',
      deviceType: 'Desktop',
      emailSent: true,
    },
    {
      id: '3',
      ip: '172.56.21.89',
      timestamp: '2026-10-21T02:10:00Z',
      country: 'United States',
      deviceType: 'Mobile',
      emailSent: true,
    },
  ];

  const stats = calculateAnalyticsStats(sampleLogs);
  assert.equal(stats.totalVisits, 3);
  assert.equal(stats.uniqueIps, 2);
  assert.equal(stats.countries['India'], 2);
  assert.equal(stats.countries['United States'], 1);
  assert.equal(stats.devices['Desktop'], 2);
  assert.equal(stats.devices['Mobile'], 1);
});

test('generateVisitorEmailHtml includes key visitor metrics', () => {
  const log: VisitorLog = {
    id: 'test-1',
    ip: '14.139.122.5',
    timestamp: '2026-10-21 02:00:00 IST',
    country: 'India',
    region: 'Maharashtra',
    city: 'Nagpur',
    isp: 'National Knowledge Network',
    deviceType: 'Mobile',
    browser: 'Chrome 122',
    emailSent: true,
  };

  const html = generateVisitorEmailHtml(log);
  assert.ok(html.includes('14.139.122.5'));
  assert.ok(html.includes('Nagpur'));
  assert.ok(html.includes('India'));
  assert.ok(html.includes('National Knowledge Network'));
  assert.ok(html.includes('New Portfolio Visitor Alert'));
});
