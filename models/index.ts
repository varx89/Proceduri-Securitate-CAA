import User from './User';
import Procedure from './Procedure';
import { ensureDb } from '../lib/database';

// Importing the models here registers them before ensureDb() syncs the tables
export { User, Procedure, ensureDb };
