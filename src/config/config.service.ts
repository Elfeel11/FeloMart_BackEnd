export const SEVER_PORT = process.env.SEVER_PORT || 5000;

export const NODE_ENV = process.env.NODE_ENV;
export const DB_URL_LOCAL = process.env.DB_URL_LOCAL || 5000;
export const DB_URI = process.env.DB_URI || 5000;

export const SALT_ROUND = parseInt(process.env.SALT_ROUND as string) || 10;
export const ECRYPTION_kEY = process.env.ECRYPTION_kEY as string;

export const TOKEN_SIGNATURE_USER_ACCESS = process.env
  .TOKEN_SIGNATURE_USER_ACCESS as string;
export const TOKEN_SIGNATURE_ADMIN_ACCESS = process.env
  .TOKEN_SIGNATURE_ADMIN_ACCESS as string;
export const TOKEN_SIGNATURE_USER_REFRESH = process.env
  .TOKEN_SIGNATURE_USER_REFRESH as string;
export const TOKEN_SIGNATURE_ADMIN_REFRESH = process.env
  .TOKEN_SIGNATURE_ADMIN_REFRESH as string;
