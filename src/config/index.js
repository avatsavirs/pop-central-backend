import 'dotenv/config';

const baseConfig = {
  env: process.env.NODE_ENV || "development",
  api_key: process.env.API_KEY,
  db_url: process.env.DB_URL,
  jwtSecret: process.env.JWT_SECRET
  // auth0Domain: process.env.AUTH0_DOMAIN,
  // auth0ClientId: process.env.AUTH0_CLIENID
}

export default baseConfig;
