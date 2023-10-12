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
router.post('/barcode', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { stock_name, stock_kind, stock_price, stock_barcode, stock_expired, stock_balance_cnt } = req.body;
    try {
        const stock_expired_date = new Date(stock_expired);
        yield models_1.Stock.create({
            stock_name: stock_name,
            stock_kind: stock_kind,
            stock_price: stock_price,
            stock_barcode: stock_barcode,
            stock_expired: stock_expired_date,
            stock_balance_cnt: stock_balance_cnt,
            stock_img: '',
        });
        res.send('ok');
    }
    catch (error) {
        console.error(error);
    }
}));
router.get('/:com_seq', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let com_seq = req.params.com_seq;
    try {
        const result = yield models_1.Loading.findAndCountAll({
            where: {
                com_seq: com_seq,
                loading_type: 'I',
            },
            include: [{
                    model: models_1.Stock,
                    include: [{
                            model: models_1.Client
                        }]
                }]
        });
        res.json(result);
    }
    catch (error) {
        console.error(error);
    }
}));
router.get('/:com_seq/:limit/:offset', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let com_seq = req.params.com_seq;
    let limit = parseInt(req.params.limit);
    let offset = parseInt(req.params.offset);
    try {
        const result = yield models_1.Loading.findAll({
            where: {
                com_seq: com_seq,
                loading_type: 'I',
            },
            include: [{
                    model: models_1.Stock,
                    include: [{
                            model: models_1.Client
                        }]
                }],
            offset: (offset - 1) * limit,
            limit: limit,
        });
        res.json(result);
    }
    catch (error) {
        console.error(error);
    }
}));
router.get('/show/:wh_seq', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stockList = yield models_1.Warehouse.findAll({
            attributes: ['wh_seq'],
            include: [{
                    model: models_1.Rack,
                    include: [{
                            model: models_1.Loading,
                            include: [{
                                    model: models_1.Stock
                                }]
                        }]
                }],
            where: {
                wh_seq: req.params.wh_seq,
            }
        });
        res.json(stockList);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
router.get('/stockcount/:wh_seq', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield models_1.Warehouse.findAndCountAll({
            where: {
                wh_seq: parseInt(req.params.wh_seq)
            },
            include: [{
                    model: models_1.Rack,
                    include: [{
                            model: models_1.Loading
                        }]
                }]
        });
        res.send(`${result.count}`);
    }
    catch (error) {
        console.error(error);
    }
}));
router.get('/ware/:stock_seq', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield models_1.Stock.findOne({
            where: { stock_seq: req.params.stock_seq },
            include: { model: models_1.Loading }
        });
        res.json(result);
    }
    catch (error) {
        console.error(error);
    }
}));
exports.default = router;
