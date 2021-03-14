import 'dotenv/config';

const baseConfig = {
  env: process.env.NODE_ENV || "development",
  api_key: process.env.API_KEY,
  db_url: process.env.DB_URL
}

export default baseConfig;
