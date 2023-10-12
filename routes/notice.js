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
router.post("/alarm", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let user_seq = req.body.user_seq;
    try {
        const result = yield models_1.Notice.findAll({
            attributes: ["notice_content", "notice_seq"],
            include: [
                {
                    model: models_1.Stock,
                    attributes: ["stock_name"],
                    include: [
                        {
                            model: models_1.Loading,
                            attributes: [],
                        },
                    ],
                },
            ],
            where: {
                user_seq: user_seq,
            },
        });
        res.json(result);
    }
    catch (error) {
        console.error("오류:", error);
        res.status(500).json({ error: "서버 오류" });
    }
}));
router.post("/change", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { user_seq, stock_name, notice_content } = req.body;
    try {
        const result = yield models_1.Notice.findOne({
            attributes: ["notice_content", "notice_seq"],
            include: [
                {
                    model: models_1.Stock,
                    attributes: ["stock_name"],
                    where: { stock_name: stock_name },
                    include: [
                        {
                            model: models_1.Loading,
                            attributes: [],
                        },
                    ],
                },
            ],
            where: {
                user_seq: user_seq,
            },
        });
        if (!result) {
            return res.status(404).json({ error: "해당 알림을 찾을 수 없습니다." });
        }
        const notice_seq = result.notice_seq;
        yield models_1.Notice.update({
            notice_content: notice_content,
        }, {
            where: {
                notice_seq: notice_seq,
            },
        });
        res.json({ success: true, message: "알림 내용이 업데이트되었습니다." });
    }
    catch (error) {
        console.error("오류:", error);
        res.status(500).json({ error: "서버 오류" });
    }
}));
router.post("/list", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const com_seq = req.body.com_seq;
        const result = yield models_1.sequelize.query(`
              SELECT DISTINCT s.stock_name FROM stock AS s
            JOIN loading AS l ON l.stock_seq = s.stock_seq
              WHERE l.loading_type = 'I'  AND l.com_seq = ${com_seq}
            `);
        res.json(result);
    }
    catch (error) {
        console.error("오류:", error);
        res.status(500).json({ error: "서버 오류" });
    }
}));
router.post("/create", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { com_seq } = req.body;
    try {
        const result = yield models_1.Loading.findAll({
            attributes: [[(0, sequelize_1.fn)("SUM", (0, sequelize_1.col)("loading_cnt")), "total_loading_cnt"]],
            where: {
                com_seq: com_seq,
                [sequelize_1.Op.or]: [
                    { loading_type: "I" },
                    // { loading_type: 'O' }
                ],
            },
            include: [
                {
                    model: models_1.Stock,
                    attributes: ["stock_name", "stock_name"],
                },
            ],
            group: "stock_name",
        });
        res.json(result);
    }
    catch (error) {
        console.error(error);
    }
}));
exports.default = router;
