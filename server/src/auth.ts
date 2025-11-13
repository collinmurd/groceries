import { SignJWT, jwtVerify } from 'jose';
import { Request, Response, NextFunction } from 'express';
import { getAuthPIN, getJWTSigningKey } from './oci/secrets';
import { TimeBoxedRecordStore } from './utils/time-boxed-record-store';
import { Feature } from './models/feature';

let JWT_SECRET: Uint8Array;
getJWTSigningKey()
  .then(key => {
    JWT_SECRET = new TextEncoder().encode(key);
  })
  .catch(err => {
    console.error('Failed to retrieve JWT signing key:', err);
    process.exit(1);
  });

let VALID_PIN: string;
getAuthPIN()
  .then(pin => {
    VALID_PIN = pin;
  })
  .catch(err => {
    console.error('Failed to retrieve auth PIN:', err);
    process.exit(1);
  });

const TOKEN_EXPIRY = '30d'; // Token expiry duration

const failedAttemptsStore = new TimeBoxedRecordStore<number>(15 * 60 * 1000); // 15 minutes
const STORE_KEY = 'login';

async function lockApp() {
  Feature.findOneAndUpdate({ name: 'app-locked' }, { enabled: true }, { new: true })
    .then(data => {
      if (data) {
        console.log('Application locked');
      } else {
        console.error('Feature not found');
      }
    })
    .catch(err => {
      console.error('Error locking application:', err);
    });
}

async function isAppLocked() {
  const feature = await Feature.findOne({ name: 'app-locked' });
  return feature ? feature.enabled : false;
}

export async function login(req: Request, res: Response) {
  try {
    if ((failedAttemptsStore.get(STORE_KEY) || 0) >= 5) {
      await lockApp();
      return res.status(401).json({ error: 'Too many failed login attempts. Application must be unlocked.' });
    }

    const { pin } = req.body;
    if (!pin || pin !== VALID_PIN) {
      // Track failed attempts
      const attempts = failedAttemptsStore.get(STORE_KEY) || 0;
      failedAttemptsStore.set(STORE_KEY, attempts + 1);
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
  if (await isAppLocked()) {
    return res.status(401).json({ error: 'Application is locked due to too many failed login attempts. Application must be unlocked.' });
  }

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