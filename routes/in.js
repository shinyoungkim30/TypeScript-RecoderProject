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
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const img_1 = require("../controllers/img");
const router = express_1.default.Router();
try {
    fs_1.default.readdirSync("uploads");
}
catch (error) {
    fs_1.default.mkdirSync("uploads");
}
const upload = (0, multer_1.default)({
    storage: multer_1.default.diskStorage({
        destination(req, file, done) {
            done(null, "uploads");
        },
        filename(req, file, done) {
            const ext = path_1.default.extname(file.originalname);
            done(null, path_1.default.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});
router.post("/img", upload.single("file"), img_1.updateStockAfterUploadImg);
router.get("/:com_seq/:loading_type", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let com_seq = req.params.com_seq;
    let loading_type = req.params.loading_type;
    let date = "";
    if (loading_type === "O") {
        date = "out_created_at";
    }
    else {
        date = "created_at";
    }
    try {
        const result = yield models_1.Loading.findAll({
            where: {
                com_seq: com_seq,
                loading_type: loading_type,
            },
            include: [{
                    model: models_1.Stock,
                    include: [{
                            model: models_1.Client,
                        }],
                }],
            order: [[(0, sequelize_1.col)(date), "DESC"]],
            limit: 5,
        });
        res.json(result);
    }
    catch (error) {
        console.error(error);
    }
}));
router.get("/cnt/:com_seq/:loading_type", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let com_seq = req.params.com_seq;
    let loading_type = req.params.loading_type;
    try {
        const result = yield models_1.Loading.count({
            where: {
                com_seq: com_seq,
                loading_type: loading_type,
            },
            include: [{
                    model: models_1.Stock,
                    include: [{
                            model: models_1.Client,
                        }],
                }],
        });
        res.json(result);
    }
    catch (error) {
        console.error(error);
    }
}));
router.post("/barcode", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let barcode = req.body.barcode;
    let com_seq = req.body.com_seq;
    try {
        const result = yield models_1.Stock.findAll({
            where: {
                stock_barcode: barcode,
            },
        });
        let { stock_seq, stock_balance_cnt } = result[0];
        yield models_1.Loading.create({
            loading_type: null,
            loading_cnt: stock_balance_cnt,
            com_seq: com_seq,
            stock_seq: stock_seq,
        });
        res.send("ok");
    }
    catch (error) {
        console.error(error);
    }
}));
router.post("/create", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { com_seq } = req.body;
    try {
        const result = yield models_1.Loading.findAll({
            where: {
                loading_type: null,
                com_seq: com_seq,
            },
            include: [{
                    model: models_1.Stock,
                }],
        });
        res.json(result);
    }
    catch (error) {
        console.error(error);
    }
}));
router.post("/send/loading", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { com_seq, stock_seq } = req.body;
    try {
        const result2 = yield models_1.Loading.update({ loading_type: "B" }, {
            where: {
                stock_seq: stock_seq,
                com_seq: com_seq,
            },
        });
        const io = req.app.get("io");
        io.of("/in").emit("updateIn", "입고등록완료");
        res.json(result2);
    }
    catch (error) {
        console.log(error);
    }
}));
router.post("/get/loading", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let com_seq = req.body.com_seq;
    try {
        console.log("in_02 : com_seq", com_seq);
        const result = yield models_1.Loading.findAll({
            where: {
                loading_type: "B",
                com_seq: com_seq,
            },
            include: [{
                    model: models_1.Stock,
                }],
        });
        res.json(result);
    }
    catch (error) {
        console.log(error);
    }
}));
router.post("/del/loaing", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let stock_seq = req.body.stock_seq;
    try {
        const result = yield models_1.Loading.update({
            loading_type: null,
        }, {
            where: {
                stock_seq: stock_seq,
            },
            include: [{
                    model: models_1.Stock,
                }],
        });
        const io = req.app.get("io");
        io.of("/in").emit("updateIn", "입고취소완료");
        res.json(result);
    }
    catch (error) {
        console.log("입고취소 에러", error);
    }
}));
router.post("/loading", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { rack_seq, loading_seq, loading_floor, loading_position, loading_manager, com_seq, } = req.body;
    try {
        const result2 = yield models_1.Loading.update({
            loading_type: "I",
            rack_seq: rack_seq,
            loading_floor: loading_floor,
            loading_position: loading_position,
            loading_manager: loading_manager,
        }, {
            where: {
                loading_seq: loading_seq,
                com_seq: com_seq,
            },
        });
        res.json(result2);
    }
    catch (error) {
        console.log(error);
    }
}));
router.patch("/position", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { stock_seq, x, z, y, rack_seq } = req.body;
    let loading_floor = parseInt(y);
    let loading_position = [x, z].join(",");
    try {
        yield models_1.Loading.update({
            loading_type: "I",
            loading_floor: loading_floor,
            loading_position: loading_position,
            rack_seq: rack_seq,
        }, {
            where: { stock_seq: stock_seq },
        });
        const io = req.app.get("io");
        io.of("/in").emit("updateIn", "입고완료");
        res.send("ok");
    }
    catch (error) {
        console.error(error);
    }
}));
exports.default = router;
