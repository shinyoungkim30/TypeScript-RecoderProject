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
const warehouse_1 = __importDefault(require("./warehouse"));
const loading_1 = __importDefault(require("./loading"));
class Company extends sequelize_1.Model {
    static initiate(sequelize) {
        Company.init({
            com_seq: {
                type: sequelize_1.default.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                comment: "기업 식별자"
            },
            com_business_num: {
                type: sequelize_1.default.STRING(100),
                allowNull: false,
                comment: "사업자등록번호"
            },
            com_name: {
                type: sequelize_1.default.STRING(50),
                allowNull: false,
                comment: "기업명"
            },
            com_address: {
                type: sequelize_1.default.STRING(600),
                allowNull: false,
                comment: "기업 주소"
            },
            com_tel: {
                type: sequelize_1.default.STRING(50),
                allowNull: false,
                comment: "기업 연락처"
            },
            created_at: {
                type: sequelize_1.default.DATE,
                allowNull: false,
                defaultValue: sequelize_1.default.NOW
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
        });
    }
    static associate() {
        Company.hasMany(user_1.default, { foreignKey: 'com_seq', sourceKey: 'com_seq' });
        Company.hasMany(warehouse_1.default, { foreignKey: 'com_seq', sourceKey: 'com_seq' });
        Company.hasMany(loading_1.default, { foreignKey: 'com_seq', sourceKey: 'com_seq' });
    }
}
exports.default = Company;
