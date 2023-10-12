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
const rack_1 = __importDefault(require("./rack"));
class Warehouse extends sequelize_1.Model {
    static initiate(sequelize) {
        Warehouse.init({
            wh_seq: {
                type: sequelize_1.default.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                comment: "창고 식별자"
            },
            wh_name: {
                type: sequelize_1.default.STRING(255),
                allowNull: false,
                comment: "창고 이름"
            },
            wh_width: {
                type: sequelize_1.default.DECIMAL(18, 4),
                allowNull: false,
                comment: "창고 가로 면적"
            },
            wh_length: {
                type: sequelize_1.default.DECIMAL(18, 4),
                allowNull: false,
                comment: "창고 세로 면적"
            },
            createdAt: sequelize_1.default.DATE,
            updatedAt: sequelize_1.default.DATE,
            deletedAt: sequelize_1.default.DATE,
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Warehouse',
            tableName: 'warehouse',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        });
    }
    static associate() {
        Warehouse.belongsTo(company_1.default, { foreignKey: 'com_seq', targetKey: 'com_seq' });
        Warehouse.hasMany(rack_1.default, { foreignKey: 'wh_seq', sourceKey: 'wh_seq' });
    }
}
exports.default = Warehouse;
