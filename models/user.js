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
const company_1 = __importDefault(require("./company"));
const notice_1 = __importDefault(require("./notice"));
class User extends sequelize_1.Model {
    static initiate(sequelize) {
        User.init({
            user_seq: {
                type: sequelize_1.default.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                comment: "사용자 식별자"
            },
            user_id: {
                type: sequelize_1.default.STRING(50),
                allowNull: false,
                unique: true,
                comment: "사용자 로그인 아이디"
            },
            user_pw: {
                type: sequelize_1.default.STRING(200),
                allowNull: false,
                comment: "사용자 로그인 패스워드"
            },
            user_nick: {
                type: sequelize_1.default.STRING(50),
                allowNull: false,
                comment: '사용자 닉네임'
            },
            createdAt: sequelize_1.default.DATE,
            updatedAt: sequelize_1.default.DATE,
            deletedAt: sequelize_1.default.DATE,
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'User',
            tableName: 'user',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        });
    }
    static associate() {
        User.belongsTo(company_1.default, { foreignKey: 'com_seq', targetKey: 'com_seq' });
        User.hasMany(notice_1.default, { foreignKey: 'user_seq', sourceKey: 'user_seq' });
    }
}
exports.default = User;
