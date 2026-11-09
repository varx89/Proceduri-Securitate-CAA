import { DataTypes, Model } from 'sequelize';
import sequelize from '../lib/database';

class Procedure extends Model {
  declare id: number;
  declare title: string;
  declare description: string;
  declare category: string;
  declare filePath: string;
  declare fileName: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Procedure.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM('proceduri', 'politici'),
      allowNull: false,
    },
    filePath: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Procedure',
  }
);

export default Procedure;
