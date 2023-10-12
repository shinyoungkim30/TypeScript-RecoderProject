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
const warehouse_1 = __importDefault(require("./warehouse"));
const loading_1 = __importDefault(require("./loading"));
class Rack extends sequelize_1.Model {
    static initiate(sequelize) {
        Rack.init({
            rack_seq: {
                type: sequelize_1.default.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                comment: '랙 식별자'
            },
            rack_id: {
                type: sequelize_1.default.STRING(255),
                allowNull: false,
                comment: '랙 아이디'
            },
            rack_position: {
                type: sequelize_1.default.STRING(100),
                allowNull: false,
                comment: '랙 구역'
            },
            rack_x: {
                type: sequelize_1.default.DECIMAL(18, 4),
                allowNull: false,
                comment: '랙 X 좌표'
            },
            rack_z: {
                type: sequelize_1.default.DECIMAL(18, 4),
                allowNull: false,
                comment: '랙 Z 좌표'
            },
            rack_width: {
                type: sequelize_1.default.DECIMAL(18, 4),
                allowNull: false,
                comment: '랙 가로 면적'
            },
            rack_length: {
                type: sequelize_1.default.DECIMAL(18, 4),
                allowNull: false,
                comment: '랙 세로 면적'
            },
            rack_floor: {
                type: sequelize_1.default.INTEGER,
                allowNull: false,
                comment: '랙 층수'
            },
            rack_rotate_yn: {
                type: sequelize_1.default.CHAR(1),
                allowNull: true,
                comment: '랙 회전 여부'
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Rack',
            tableName: 'rack',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        });
    }
    static associate() {
        Rack.belongsTo(warehouse_1.default, { foreignKey: 'wh_seq', targetKey: 'wh_seq' });
        Rack.hasMany(loading_1.default, { foreignKey: 'rack_seq', sourceKey: 'rack_seq' });
    }
}
exports.default = Rack;
