import Sequelize, {
    Model, CreationOptional, InferAttributes, InferCreationAttributes, ForeignKey,
} from 'sequelize';
import User from './user';
import Stock from './stock';

class Notice extends Model<InferAttributes<Notice>, InferCreationAttributes<Notice>> {
    declare notice_seq: CreationOptional<number>;
    declare notice_content: string;
    declare noticed_at: Date;

    declare user_seq: ForeignKey<User['user_id']>;
    declare stock_seq: ForeignKey<Stock['stock_seq']>;

    static initiate(sequelize: Sequelize.Sequelize) {
        Notice.init({
            notice_seq: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                comment: '알림 식별자'
            },
            notice_content: {
                type: Sequelize.TEXT,
                allowNull: false,
                comment: '알림 내용'
            },
            noticed_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
                comment: '알림 날짜'
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Notice',
            tableName: 'notice',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        })
    }

    static associate() {
        Notice.belongsTo(User, { foreignKey: 'user_seq', targetKey: 'user_seq' })
        Notice.belongsTo(Stock, { foreignKey: 'stock_seq', targetKey: 'stock_seq' })
    }
}

export default Notice;