import { DataTypes, Model } from 'sequelize';
import sequelize from '../lib/database';

class Procedure extends Model {
  public id!: number;
  public title!: string;
  public description!: string;
  public category!: string;
  public filePath!: string;
  public fileName!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
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
