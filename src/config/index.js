import 'dotenv/config';

const baseConfig = {
  env: process.env.NODE_ENV || "development",
  api_key: process.env.API_KEY
}

export default baseConfig;
