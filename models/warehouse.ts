import Sequelize, {
    Model, CreationOptional, InferAttributes, InferCreationAttributes, ForeignKey,
} from 'sequelize';
import Company from './company';
import Rack from './rack';

class Warehouse extends Model<InferAttributes<Warehouse>, InferCreationAttributes<Warehouse>> {
    declare wh_seq: CreationOptional<number>;
    declare wh_name: string;
    declare wh_width: number;
    declare wh_length: number;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare deletedAt: CreationOptional<Date>;

    declare com_seq: ForeignKey<Company['com_seq']>;

    static initiate(sequelize: Sequelize.Sequelize) {
        Warehouse.init({
            wh_seq: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                comment: "창고 식별자"
            },
            wh_name: {
                type: Sequelize.STRING(255),
                allowNull: false,
                comment: "창고 이름"
            },
            wh_width: {
                type: Sequelize.DECIMAL(18, 4),
                allowNull: false,
                comment: "창고 가로 면적"
            },
            wh_length: {
                type: Sequelize.DECIMAL(18, 4),
                allowNull: false,
                comment: "창고 세로 면적"
            },
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE,
            deletedAt: Sequelize.DATE,
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Warehouse',
            tableName: 'warehouse',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        })
    }

    static associate() {
        Warehouse.belongsTo(Company, { foreignKey: 'com_seq', targetKey: 'com_seq' })
        Warehouse.hasMany(Rack, { foreignKey: 'wh_seq', sourceKey: 'wh_seq' })
    }
}

export default Warehouse;