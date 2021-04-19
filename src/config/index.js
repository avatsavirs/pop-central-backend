import 'dotenv/config';

const baseConfig = {
  env: process.env.NODE_ENV || "development",
  api_key: process.env.API_KEY,
  db_url: process.env.DB_URL,
  jwtSecret: process.env.JWT_ACC_TKN_SECRET,
  jwtSecretRef: process.env.JWT_REF_TKN_SECRET,
  jwtAccessExpTime: process.env.JWT_ACC_TKN_EXP,
  jwtRefExpTime: process.env.JWT_REF_TKN_EXP
}

export default baseConfig;
