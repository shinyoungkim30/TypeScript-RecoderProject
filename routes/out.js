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
const sequelize_1 = require("sequelize");
const router = express_1.default.Router();
router.post("/create", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const q = models_1.Warehouse.findAll({
        where: {
            wh_seq: req.body.wh_seq,
        },
        attributes: ["wh_seq", "wh_name"],
        include: [{
                model: models_1.Rack,
                include: [{
                        model: models_1.Loading,
                        where: {
                            loading_type: "I",
                        },
                        include: [{
                                model: models_1.Stock,
                            }],
                    }],
            }],
    });
    const q2 = models_1.Loading.findAll({
        attributes: [
            (0, sequelize_1.fn)("DISTINCT", (0, sequelize_1.col)("stock_shipping_des")),
            "stock_shipping_des",
        ],
        where: {
            com_seq: req.body.com_seq,
            loading_type: "O",
        },
    });
    return Promise.all([q, q2])
        .then(([result1, result2]) => {
        res.json({ result1, result2 });
    })
        .catch((error) => {
        console.log("에러", error);
    });
}));
router.post("/create/loading", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const outLoading = yield models_1.Loading.update({
            loading_type: "O",
            out_created_at: req.body.created_at,
            loading_cnt: req.body.loading_cnt,
            stock_shipping_des: req.body.stock_shipping_des,
            loading_manager: req.body.loading_manager,
            loading_floor: null,
            loading_position: null,
        }, {
            where: {
                loading_seq: req.body.loading_seq,
            },
        });
        // socket -------------------------
        const io = req.app.get("io");
        io.of("/out").emit("updateOut", "출고완료");
        // --------------------------------
        res.json(outLoading);
    }
    catch (error) {
        console.log(error);
    }
}));
router.post("/controll", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id, wh_seq } = req.body;
    try {
        const outControllList = yield models_1.User.findAll({
            attributes: ["com_seq"],
            where: {
                user_id: id,
            },
            include: [{
                    model: models_1.Company,
                    include: [{
                            model: models_1.Warehouse,
                            where: {
                                wh_seq: wh_seq,
                            },
                            attributes: ["wh_seq", "wh_name"],
                            include: [{
                                    model: models_1.Rack,
                                    include: [{
                                            model: models_1.Loading,
                                            where: {
                                                loading_type: "O",
                                            },
                                            include: [{
                                                    model: models_1.Stock,
                                                }],
                                        }],
                                }],
                        }],
                }],
        });
        res.json(outControllList);
    }
    catch (error) {
        console.error(error);
    }
}));
router.post("/des", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { wh_seq } = req.body;
    try {
        const desDetail = yield models_1.Warehouse.findAll({
            where: {
                wh_seq: wh_seq,
            },
            attributes: ["wh_name"],
            include: [{
                    model: models_1.Rack,
                    attributes: ["rack_seq"],
                    include: [{
                            model: models_1.Loading,
                            where: { loading_type: "O" },
                            attributes: ["stock_shipping_des", "out_created_at"],
                            include: [{
                                    model: models_1.Stock,
                                    attributes: ["stock_name", "stock_kind"],
                                }],
                        }],
                }],
        });
        res.json(desDetail);
    }
    catch (error) {
        console.error(error);
    }
}));
router.post("/des/name", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("1번", req.body);
    let { wh_seq } = req.body;
    try {
        const sNameList = yield models_1.Warehouse.findAll({
            attributes: [],
            include: [{
                    model: models_1.Rack,
                    where: {
                        wh_seq: wh_seq,
                    },
                    include: [{
                            model: models_1.Loading,
                            attributes: [
                                [(0, sequelize_1.fn)("SUM", (0, sequelize_1.col)("loading_cnt")), "total_loading_cnt"],
                                "out_created_at",
                            ],
                            where: {
                                loading_type: "O",
                            },
                            include: [{
                                    model: models_1.Stock,
                                }],
                        }],
                }],
            group: ["stock_name"],
            order: [
                [(0, sequelize_1.col)("out_created_at"), "DESC"],
            ],
        });
        res.json(sNameList);
    }
    catch (error) {
        console.error(error);
    }
}));
router.post("/des/count", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { wh_seq, stock_name } = req.body;
    try {
        const result = yield models_1.Stock.findAll({
            attributes: [[(0, sequelize_1.fn)("SUM", (0, sequelize_1.col)("loading_cnt")), "total_loading_cnt"]],
            where: {
                stock_name: stock_name,
            },
            include: [{
                    model: models_1.Loading,
                    attributes: ["stock_shipping_des", "loading_cnt"],
                    where: {
                        loading_type: "O",
                    },
                    include: [{
                            model: models_1.Rack,
                            attributes: [],
                            where: {
                                wh_seq: wh_seq,
                            },
                            include: [{
                                    model: models_1.Warehouse,
                                    attributes: ["wh_seq"],
                                }],
                        }],
                }],
            group: "stock_shipping_des",
        });
        res.json(result);
    }
    catch (error) {
        console.error(error);
    }
}));
exports.default = router;
