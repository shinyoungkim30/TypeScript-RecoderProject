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
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = req.body;
        const arr = items.map((item) => ({
            rack_id: item.rackName,
            rack_position: "",
            rack_width: item.rackWidth,
            rack_length: item.rackLength,
            rack_floor: item.rackFloor,
            rack_x: item.rackX,
            rack_z: item.rackZ,
            rack_rotate_yn: item.rackRotationYN,
            wh_seq: item.wh_seq,
        }));
        yield models_1.Rack.bulkCreate(arr);
        res.send("창고 생성 성공");
    }
    catch (error) {
        console.error(error);
    }
}));
router.get("/:wh_seq", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("qwe");
    let wh_seq = req.params.wh_seq;
    try {
        const rackList = yield models_1.Rack.findAll({
            where: {
                wh_seq: wh_seq,
            },
            include: [{
                    model: models_1.Loading,
                    include: [{
                            model: models_1.Stock,
                        }],
                }],
        });
        res.json(rackList);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
exports.default = router;
