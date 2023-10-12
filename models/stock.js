"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importStar(require("sequelize"));
const loading_1 = __importDefault(require("./loading"));
const notice_1 = __importDefault(require("./notice"));
const client_1 = __importDefault(require("./client"));
class Stock extends sequelize_1.Model {
    static initiate(sequelize) {
        Stock.init({
            stock_seq: {
                type: sequelize_1.default.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                comment: '적재물 식별자'
            },
            stock_name: {
                type: sequelize_1.default.STRING(255),
                allowNull: false,
                comment: '적재물 이름'
            },
            stock_kind: {
                type: sequelize_1.default.STRING(255),
                allowNull: false,
                comment: '적재물 종류'
            },
            stock_price: {
                type: sequelize_1.default.INTEGER,
                allowNull: false,
                comment: '적재물 가격'
            },
            stock_barcode: {
                type: sequelize_1.default.STRING(255),
                allowNull: false,
                comment: '적재물 바코드'
            },
            stock_img: {
                type: sequelize_1.default.TEXT,
                allowNull: false,
                comment: '적재물 이미지'
            },
            stock_expired: {
                type: sequelize_1.default.DATE,
                allowNull: false,
                comment: '적재물 유통기한'
            },
            stock_balance_cnt: {
                type: sequelize_1.default.INTEGER,
                allowNull: false,
                comment: '적정 재고량'
            },
            update_at: {
                type: sequelize_1.default.DATE,
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
        });
    }
    static associate() {
        Stock.hasOne(loading_1.default, { foreignKey: 'stock_seq', sourceKey: 'stock_seq' });
        Stock.hasMany(notice_1.default, { foreignKey: 'stock_seq', sourceKey: 'stock_seq' });
        Stock.belongsTo(client_1.default, { foreignKey: 'cl_seq', targetKey: 'cl_seq' });
    }
}
exports.default = Stock;
