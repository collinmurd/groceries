// server/src/auth.ts
import axios from 'axios';
import crypto from 'crypto';
import express, { Request, Response } from 'express';
import ENVIRONMENT from './env';

const authRouter = express.Router();

const ALLOWED_USERS = ['collinmurd']; // update with allowed GitHub usernames

// In-memory session store for demonstration purposes
const sessions = new Map<string, { username: string; createdAt: Date }>();

function createSession(username: string): string {
  const token = crypto.randomBytes(16).toString('hex');
  sessions.set(token, { username, createdAt: new Date() });
  return token;
}

// 1. Redirect client to GitHub for authentication
authRouter.get('/login', (req: Request, res: Response) => {
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${ENVIRONMENT.GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(
    ENVIRONMENT.API_REDIRECT_URI
  )}&scope=read:user`;
  res.redirect(githubAuthUrl);
});

// 3. GitHub callback endpoint
authRouter.get('/github/callback', async (req: Request, res: Response) => {
  const code = req.query.code as string;
  if (!code) {
    return res.status(400).send('Missing code parameter');
  }
  try {
    // 4. Exchange code for access token
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: ENVIRONMENT.GITHUB_CLIENT_ID,
        client_secret: ENVIRONMENT.GITHUB_CLIENT_SECRET,
        code,
      },
      { headers: { Accept: 'application/json' } }
    );

    const accessToken = tokenResponse.data.access_token;
    if (!accessToken) {
      return res.status(400).send('Failed to obtain access token');
    }

    // 5. Retrieve GitHub user info and verify access
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const username = userResponse.data.login as string;
    if (!ALLOWED_USERS.includes(username)) {
      return res.status(403).send('User not allowed');
    }

    // 6. Create session in the database (here, in memory) and session token
    const sessionToken = createSession(username);

    // 7. Set cookie and redirect back to the client app
    res.cookie('session_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    res.redirect(ENVIRONMENT.CLIENT_REDIRECT_URI);
  } catch (err) {
    console.error(err);
    res.status(500).send('Authentication failed');
  }
});

export default authRouter;