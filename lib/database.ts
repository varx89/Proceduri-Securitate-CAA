import { Sequelize } from 'sequelize';
import mysql2 from 'mysql2';

// Reuse the connection pool across hot reloads in development
const globalForDb = globalThis as unknown as { sequelize?: Sequelize; dbReady?: Promise<void> };

const sequelize =
  globalForDb.sequelize ??
  new Sequelize(process.env.DB_NAME ?? '', process.env.DB_USER ?? '', process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    dialect: 'mysql',
    dialectModule: mysql2,
    logging: false,
    timezone: '+00:00',
    define: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
    },
  });

globalForDb.sequelize = sequelize;

// Creates missing tables once per process; existing tables and data are left untouched
export function ensureDb(): Promise<void> {
  if (!process.env.DB_HOST || !process.env.DB_NAME || !process.env.DB_USER) {
    return Promise.reject(new Error('Lipsesc variabilele DB_HOST, DB_NAME sau DB_USER din env'));
  }
  globalForDb.dbReady ??= sequelize.sync().then(() => undefined);
  globalForDb.dbReady.catch(() => {
    globalForDb.dbReady = undefined;
  });
  return globalForDb.dbReady;
}

export default sequelize;
