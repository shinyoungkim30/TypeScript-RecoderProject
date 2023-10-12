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
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { width, length, name, comSeq } = req.body;
    try {
        const result = yield models_1.Warehouse.create({
            wh_name: name,
            wh_width: width,
            wh_length: length,
            com_seq: comSeq
        });
        res.json(result.toJSON());
    }
    catch (error) {
        console.error(error);
    }
}));
router.get('/manage/:com_seq', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let com_seq = req.params.com_seq;
    try {
        const warehouseList = yield models_1.Warehouse.findAll({
            attributes: ['wh_name', 'createdAt', 'wh_seq'],
            where: {
                com_seq: com_seq
            },
            include: [{
                    model: models_1.Rack,
                    include: [{
                            model: models_1.Loading,
                            include: [{
                                    model: models_1.Stock
                                }]
                        }]
                }]
        });
        res.json(warehouseList);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
router.get('/wh_name/:com_seq', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const nameList = yield models_1.Warehouse.findAndCountAll({
            attributes: ['wh_name'],
            where: {
                com_seq: req.params.com_seq,
            },
            include: [{
                    model: models_1.Rack,
                    attributes: ['rack_seq'],
                    include: [{
                            model: models_1.Loading,
                            where: {
                                loading_type: 'I'
                            },
                            attributes: ['loading_seq'],
                            include: [{
                                    model: models_1.Stock,
                                    attributes: ['stock_name']
                                }]
                        }]
                }]
        });
        res.json(nameList);
    }
    catch (error) {
        console.error(error);
    }
}));
router.get('/shortList/:com_seq', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let com_seq = req.params.com_seq;
    try {
        const warehouseList = yield models_1.Warehouse.findAll({
            attributes: ['wh_name', 'createdAt', 'wh_seq'],
            where: {
                com_seq: com_seq
            },
            include: [{
                    model: models_1.Rack,
                    include: [{
                            model: models_1.Loading,
                            include: [{
                                    model: models_1.Stock
                                }]
                        }]
                }],
            limit: 3
        });
        res.json(warehouseList);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
exports.default = router;
