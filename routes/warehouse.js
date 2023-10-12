"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const models_1 = require("../models");
const router = express_1.default.Router();
router.get('/:wh_seq', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let wh_seq = req.params.wh_seq;
    try {
        const warehouseList = yield models_1.Warehouse.findOne({
            attributes: ['wh_width', 'wh_length'],
            where: {
                wh_seq: wh_seq
            },
        });
        res.json(warehouseList);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
router.delete('/:wh_seq', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield models_1.Warehouse.destroy({
            where: {
                wh_seq: req.params.wh_seq
            }
        });
        res.json(result);
    }
    catch (error) {
        console.error(error);
    }
}));
router.get('/wh_name/:com_seq', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const wareNameList = yield models_1.Warehouse.findAll({
            where: { com_seq: req.params.com_seq },
            attributes: ['wh_name'],
        });
        res.json(wareNameList);
    }
    catch (error) {
        console.error(error);
    }
}));
exports.default = router;
