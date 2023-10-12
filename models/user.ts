import Sequelize, {
    Model, CreationOptional, InferAttributes, InferCreationAttributes,
} from 'sequelize';
import Company from './company';
import Notice from './notice';

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare user_seq: CreationOptional<number>;
    declare user_id: string;
    declare user_pw: string;
    declare user_nick: string;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare deletedAt: CreationOptional<Date>;

    static initiate(sequelize: Sequelize.Sequelize) {
        User.init({
            user_seq: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                comment: "사용자 식별자"
            },
            user_id: {
                type: Sequelize.STRING(50),
                allowNull: false,
                unique: true,
                comment: "사용자 로그인 아이디"
            },
            user_pw: {
                type: Sequelize.STRING(200),
                allowNull: false,
                comment: "사용자 로그인 패스워드"
            },
            user_nick: {
                type: Sequelize.STRING(50),
                allowNull: false,
                comment: '사용자 닉네임'
            },
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE,
            deletedAt: Sequelize.DATE,
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'User',
            tableName: 'user',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        })
    }

    static associate() {
        User.belongsTo(Company, { foreignKey: 'com_seq', targetKey: 'com_seq' })
        User.hasMany(Notice, { foreignKey: 'user_seq', sourceKey: 'user_seq' })
    }
}

export default User;