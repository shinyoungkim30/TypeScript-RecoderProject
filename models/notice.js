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
const user_1 = __importDefault(require("./user"));
const stock_1 = __importDefault(require("./stock"));
class Notice extends sequelize_1.Model {
    static initiate(sequelize) {
        Notice.init({
            notice_seq: {
                type: sequelize_1.default.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                comment: '알림 식별자'
            },
            notice_content: {
                type: sequelize_1.default.TEXT,
                allowNull: false,
                comment: '알림 내용'
            },
            noticed_at: {
                type: sequelize_1.default.DATE,
                allowNull: false,
                defaultValue: sequelize_1.default.NOW,
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
        });
    }
    static associate() {
        Notice.belongsTo(user_1.default, { foreignKey: 'user_seq', targetKey: 'user_seq' });
        Notice.belongsTo(stock_1.default, { foreignKey: 'stock_seq', targetKey: 'stock_seq' });
    }
}
exports.default = Notice;
