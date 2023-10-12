import Sequelize, {
    Model, CreationOptional, InferAttributes, InferCreationAttributes,
} from 'sequelize';
import Warehouse from './warehouse';
import Loading from './loading';

class Rack extends Model<InferAttributes<Rack>, InferCreationAttributes<Rack>> {
    declare rack_seq: CreationOptional<number>;
    declare rack_id: string;
    declare rack_position: string;
    declare rack_x: number;
    declare rack_z: number;
    declare rack_width: number;
    declare rack_length: number;
    declare rack_floor: number;
    declare rack_rotate_yn: CreationOptional<string>;

    static initiate(sequelize: Sequelize.Sequelize) {
        Rack.init({
            rack_seq: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                comment: '랙 식별자'
            },
            rack_id: {
                type: Sequelize.STRING(255),
                allowNull: false,
                comment: '랙 아이디'
            },
            rack_position: {
                type: Sequelize.STRING(100),
                allowNull: false,
                comment: '랙 구역'
            },
            rack_x: {
                type: Sequelize.DECIMAL(18, 4),
                allowNull: false,
                comment: '랙 X 좌표'
            },
            rack_z: {
                type: Sequelize.DECIMAL(18, 4),
                allowNull: false,
                comment: '랙 Z 좌표' 
            },
            rack_width: {
                type: Sequelize.DECIMAL(18, 4),
                allowNull: false,
                comment: '랙 가로 면적'
            },
            rack_length: {
                type: Sequelize.DECIMAL(18, 4),
                allowNull: false,
                comment: '랙 세로 면적'
            },
            rack_floor: {
                type: Sequelize.INTEGER,
                allowNull: false,
                comment: '랙 층수'
            },
            rack_rotate_yn: {
                type: Sequelize.CHAR(1),
                allowNull: true,
                comment: '랙 회전 여부'
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Rack',
            tableName: 'rack',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        })
    }

    static associate() {
        Rack.belongsTo(Warehouse, { foreignKey: 'wh_seq', targetKey: 'wh_seq' })
        Rack.hasMany(Loading, { foreignKey: 'rack_seq', sourceKey: 'rack_seq' })
    }
}

export default Rack;