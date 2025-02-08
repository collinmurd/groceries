
import 'dotenv/config';

const ENVIRONMENT = {
  NAME: process.env.ENV || 'dev',
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  API_REDIRECT_URI: process.env.API_REDIRECT_URI || 'http://localhost:8000/auth/github/callback',
  CLIENT_REDIRECT_URI: process.env.CLIENT_REDIRECT_URI || 'http://localhost:3000/groceries',
  CLIENT_REDIRECT_UNAUTHORIZED: process.env.CLIENT_REDIRECT_UNAUTHORIZED || 'http://localhost:3000/groceries/unauthorized',
  MONGO_HOST: process.env.MONGO_HOST || '127.0.0.1',
  PORT: process.env.PORT || 8000,
  INTERNAL_SERVER_ERROR: 'Internal server error',
};

export default ENVIRONMENT;