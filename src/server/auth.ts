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
  const configuredEmail = ADMIN_CONFIG.email.trim().toLowerCase();

  if (cleanEmail !== configuredEmail || pass !== ADMIN_CONFIG.password) {
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
  const session = sessions.get(token);
  if (!session) return false;
  if (Date.now() > session.expiresAt) {
    sessions.delete(token);
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
