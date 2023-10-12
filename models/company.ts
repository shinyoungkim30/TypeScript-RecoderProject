import Sequelize, {
    Model, CreationOptional, InferAttributes, InferCreationAttributes,
} from 'sequelize';
import User from './user';
import Warehouse from './warehouse';
import Loading from './loading';

class Company extends Model<InferAttributes<Company>, InferCreationAttributes<Company>> {
    declare com_seq: CreationOptional<number>;
    declare com_business_num: string;
    declare com_name: string;
    declare com_address: string;
    declare com_tel: string;
    declare created_at: Date;

    static initiate(sequelize: Sequelize.Sequelize) {
        Company.init({
            com_seq: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                comment: "기업 식별자"
            },
            com_business_num: {
                type: Sequelize.STRING(100),
                allowNull: false,
                comment: "사업자등록번호"
            },
            com_name: {
                type: Sequelize.STRING(50),
                allowNull: false,
                comment: "기업명"
            },
            com_address: {
                type: Sequelize.STRING(600),
                allowNull: false,
                comment: "기업 주소"
            },
            com_tel: {
                type: Sequelize.STRING(50),
                allowNull: false,
                comment: "기업 연락처"
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
            }            
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Company',
            tableName: 'company',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        })
    }

    static associate() {
        Company.hasMany(User, { foreignKey: 'com_seq', sourceKey: 'com_seq' })
        Company.hasMany(Warehouse, { foreignKey: 'com_seq', sourceKey: 'com_seq' })
        Company.hasMany(Loading, { foreignKey: 'com_seq', sourceKey: 'com_seq' })
    }
}

export default Company;