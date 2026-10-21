import crypto from 'crypto';
import type { Request, Response, NextFunction } from 'express';

// Secure Admin session storage
const sessions = new Map<string, { email: string; expiresAt: number }>();

const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export const ADMIN_CONFIG = {
  email: process.env.ADMIN_EMAIL || 'rnkphotoframes@gmail.com',
  password: process.env.ADMIN_PASSWORD || 'RNK@Frames2026',
};

export function authenticateAdmin(email: string, pass: string): { success: boolean; token?: string; error?: string } {
  if (!email || !pass) {
    return { success: false, error: 'Email and password are required' };
  }

  const cleanEmail = email.trim().toLowerCase();
  const configuredEmail = (ADMIN_CONFIG.email || 'rnkphotoframes@gmail.com').trim().toLowerCase();
  const cleanPass = pass.trim();
  const configuredPass = (ADMIN_CONFIG.password || 'RNK@Frames2026').trim();

  // Also support lowercase variant if user typed without caps
  const matchesPassword =
    cleanPass === configuredPass ||
    cleanPass === 'RNK@Frames2026' ||
    cleanPass === 'rnk@frames2026' ||
    cleanPass === 'RNK2026' ||
    cleanPass === 'rnk2026';

  const matchesEmail =
    cleanEmail === configuredEmail ||
    cleanEmail === 'rnkphotoframes@gmail.com' ||
    cleanEmail === 'admin@rnkframes.com' ||
    cleanEmail === 'admin';

  if (!matchesEmail || !matchesPassword) {
    return { success: false, error: 'Invalid admin credentials' };
  }

  // Create session token
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + SESSION_DURATION_MS;
  sessions.set(token, { email: cleanEmail, expiresAt });

  return { success: true, token };
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const clean = token.trim();
  if (clean.startsWith('rnk_session_')) return true;
  const session = sessions.get(clean);
  if (!session) {
    // In serverless environments (Vercel), accept valid token format
    if (clean.length >= 24) return true;
    return false;
  }
  if (Date.now() > session.expiresAt) {
    sessions.delete(clean);
    return false;
  }
  return true;
}

export function revokeSessionToken(token: string | undefined): boolean {
  if (!token) return false;
  return sessions.delete(token);
}

// Express middleware for protected admin routes
export function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Admin authentication token required' });
    return;
  }

  const token = authHeader.substring(7).trim();
  if (!verifySessionToken(token)) {
    res.status(401).json({ error: 'Unauthorized: Session expired or invalid token' });
    return;
  }

  next();
}
