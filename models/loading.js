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
const rack_1 = __importDefault(require("./rack"));
const stock_1 = __importDefault(require("./stock"));
const company_1 = __importDefault(require("./company"));
class Loading extends sequelize_1.Model {
    static initiate(sequelize) {
        Loading.init({
            loading_seq: {
                type: sequelize_1.default.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                comment: '적재 식별자'
            },
            loading_type: {
                type: sequelize_1.default.STRING(10),
                allowNull: true,
                comment: '입출고 구분'
            },
            created_at: {
                type: sequelize_1.default.DATE,
                allowNull: false,
                defaultValue: sequelize_1.default.NOW
            },
            loading_cnt: {
                type: sequelize_1.default.INTEGER,
                allowNull: true,
                comment: '처리 수량'
            },
            loading_floor: {
                type: sequelize_1.default.INTEGER,
                allowNull: true,
                comment: '적재물 층-선반'
            },
            loading_position: {
                type: sequelize_1.default.STRING(255),
                allowNull: true,
                comment: '적재물 위치'
            },
            stock_shipping_des: {
                type: sequelize_1.default.STRING(500),
                allowNull: true,
                comment: '배송지 정보'
            },
            loading_manager: {
                type: sequelize_1.default.STRING(45),
                allowNull: true,
                comment: '입출고 담당자'
            },
            out_created_at: {
                type: sequelize_1.default.DATE,
                allowNull: true,
                comment: '출고일'
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Loading',
            tableName: 'loading',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        });
    }
    static associate() {
        Loading.belongsTo(rack_1.default, { foreignKey: 'rack_seq', targetKey: 'rack_seq' });
        Loading.belongsTo(stock_1.default, { foreignKey: 'stock_seq', targetKey: 'stock_seq' });
        Loading.belongsTo(company_1.default, { foreignKey: 'com_seq', targetKey: 'com_seq' });
    }
}
exports.default = Loading;
