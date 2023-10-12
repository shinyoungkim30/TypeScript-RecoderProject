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
const stock_1 = __importDefault(require("./stock"));
class Client extends sequelize_1.Model {
    static initiate(sequelize) {
        Client.init({
            cl_seq: {
                type: sequelize_1.default.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                comment: "거래처 식별자"
            },
            cl_business_num: {
                type: sequelize_1.default.STRING(100),
                allowNull: false,
                comment: "거래처 사업자등록번호"
            },
            cl_name: {
                type: sequelize_1.default.STRING(50),
                allowNull: false,
                comment: "거래처명"
            },
            cl_address: {
                type: sequelize_1.default.STRING(600),
                allowNull: false,
                comment: "거래처 주소"
            },
            cl_tel: {
                type: sequelize_1.default.STRING(50),
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
        });
    }
    static associate() {
        Client.hasMany(stock_1.default, { foreignKey: 'cl_seq', sourceKey: 'cl_seq' });
    }
}
exports.default = Client;
