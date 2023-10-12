import Sequelize, {
    Model, CreationOptional, InferAttributes, InferCreationAttributes,
} from 'sequelize';
import Stock from './stock';

class Client extends Model<InferAttributes<Client>, InferCreationAttributes<Client>> {
    declare cl_seq: CreationOptional<number>;
    declare cl_business_num: string;
    declare cl_name: string;
    declare cl_address: string;
    declare cl_tel: string;

    static initiate(sequelize: Sequelize.Sequelize) {
        Client.init({
            cl_seq: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                comment: "거래처 식별자"
            },
            cl_business_num: {
                type: Sequelize.STRING(100),
                allowNull: false,
                comment: "거래처 사업자등록번호"
            },
            cl_name: {
                type: Sequelize.STRING(50),
                allowNull: false,
                comment: "거래처명"
            },
            cl_address: {
                type: Sequelize.STRING(600),
                allowNull: false,
                comment: "거래처 주소"
            },
            cl_tel: {
                type: Sequelize.STRING(50),
                allowNull: false,
                comment: "거래처 연락처"
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Client',
            tableName: 'client',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        })
    }

    static associate() {
        Client.hasMany(Stock, { foreignKey: 'cl_seq', sourceKey: 'cl_seq' })
    }
}

export default Client;