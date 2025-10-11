import { SignJWT, jwtVerify } from 'jose';
import { Request, Response, NextFunction } from 'express';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

const VALID_PIN = process.env.AUTH_PIN || '1234';
const TOKEN_EXPIRY = '30d'; // Token expiry duration

export async function login(req: Request, res: Response) {
  try {
    const { pin } = req.body;

    if (!pin || pin !== VALID_PIN) {
      return res.status(401).json({ error: 'Invalid PIN' });
    }

    // Create JWT 
    const token = await new SignJWT({ authorized: true })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(TOKEN_EXPIRY)
      .sign(JWT_SECRET);

    res.json({ accessToken: token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    if (!payload.authorized) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}