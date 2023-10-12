import Sequelize, {
    Model, CreationOptional, InferAttributes, InferCreationAttributes,
} from 'sequelize';
import Loading from './loading';
import Notice from './notice';
import Client from './client';

class Stock extends Model<InferAttributes<Stock>, InferCreationAttributes<Stock>> {
    declare stock_seq: CreationOptional<number>;
    declare stock_name: string;
    declare stock_kind: string;
    declare stock_price: number;
    declare stock_barcode: string;
    declare stock_img: string;
    declare stock_expired: Date;
    declare stock_balance_cnt: number;
    declare update_at: CreationOptional<Date>;

    static initiate(sequelize: Sequelize.Sequelize) {
        Stock.init({
            stock_seq: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                comment: '적재물 식별자'
            },
            stock_name: {
                type: Sequelize.STRING(255),
                allowNull: false,
                comment: '적재물 이름'
            },
            stock_kind: {
                type: Sequelize.STRING(255),
                allowNull: false,
                comment: '적재물 종류'
            },
            stock_price: {
                type: Sequelize.INTEGER,
                allowNull: false,
                comment: '적재물 가격'
            },
            stock_barcode: {
                type: Sequelize.STRING(255),
                allowNull: false,
                comment: '적재물 바코드'
            },
            stock_img: {
                type: Sequelize.TEXT,
                allowNull: false,
                comment: '적재물 이미지'
            },
            stock_expired: {
                type: Sequelize.DATE,
                allowNull: false,
                comment: '적재물 유통기한'
            },
            stock_balance_cnt: {
                type: Sequelize.INTEGER,
                allowNull: false,
                comment: '적정 재고량'
            }, 
            update_at: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: null
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Stock',
            tableName: 'stock',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        })
    }

    static associate() {
        Stock.hasOne(Loading, { foreignKey: 'stock_seq', sourceKey: 'stock_seq' })
        Stock.hasMany(Notice, { foreignKey: 'stock_seq', sourceKey: 'stock_seq' })
        Stock.belongsTo(Client, { foreignKey: 'cl_seq', targetKey: 'cl_seq' })
    }
}

export default Stock;