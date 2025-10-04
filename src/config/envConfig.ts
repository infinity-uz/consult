// .env config
import dotenv from 'dotenv';
dotenv.config();

type ConfigType = {
  API_PORT: number;
  APP_URL: string;
  API_VERSION: string;
  DB_URL: string;
  SUPER_ADMIN: {
    SUPER_ADMIN_USERNAME: string;
    SUPER_ADMIN_PASSWORD: string;
    SUPER_ADMIN_PHONE_NUMBER: string;
  };
  TOKEN: {
    ACCESS_KEY: string;
    ACCESS_TIME: string;
    REFRESH_KEY: string;
    REFRESH_TIME: string;
  };
  OPENAI_API_KEY: string;
  REDIS: {
    REDIS_HOST: string;
    REDIS_PORT: number;
    REDIS_PASSWORD: string;
  };
};

export const config: ConfigType = {
  API_PORT: Number(process.env.PORT),
  APP_URL: String(process.env.APP_URL),
  API_VERSION: String(process.env.API_VERSION),
  DB_URL: String(process.env.DEV_DB_URL),
  SUPER_ADMIN: {
    SUPER_ADMIN_USERNAME: String(process.env.SUPERADMIN_USERNAME),
    SUPER_ADMIN_PASSWORD: String(process.env.SUPERADMIN_PASSWORD),
    SUPER_ADMIN_PHONE_NUMBER: String(process.env.SUPERADMIN_PHONE_NUMBER),
  },
  TOKEN: {
    ACCESS_KEY: String(process.env.JWT_ACCESS_SECRET),
    ACCESS_TIME: String(process.env.JWT_ACCESS_EXPIRES_IN),
    REFRESH_KEY: String(process.env.JWT_REFRESH_SECRET),
    REFRESH_TIME: String(process.env.JWT_REFRESH_EXPIRES_IN),
  },
  OPENAI_API_KEY: String(process.env.OPENAI_API_KEY),
  REDIS: {
    REDIS_HOST: String(process.env.REDIS_HOST),
    REDIS_PORT: Number(process.env.REDIS_PORT),
    REDIS_PASSWORD: String(process.env.REDIS_PASSWORD),
  },
};
