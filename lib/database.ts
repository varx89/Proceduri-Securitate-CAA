import { Sequelize } from 'sequelize';
import mysql2 from 'mysql2';

const databaseUrl = process.env.DATABASE_URL || 'mysql://root:@localhost:3306/proceduri';

// Reuse the connection pool across hot reloads in development
const globalForDb = globalThis as unknown as { sequelize?: Sequelize };

const sequelize =
  globalForDb.sequelize ??
  new Sequelize(databaseUrl, {
    dialect: 'mysql',
    dialectModule: mysql2,
    logging: false,
    timezone: '+00:00',
    define: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
    },
  });

if (process.env.NODE_ENV !== 'production') globalForDb.sequelize = sequelize;

export default sequelize;
