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
exports.updateStockAfterUploadImg = void 0;
const stock_1 = __importDefault(require("../models/stock"));
const updateStockAfterUploadImg = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let stock_seq = req.body.stock_seq;
    try {
        const result = yield stock_1.default.update({
            stock_img: `${(_a = req.file) === null || _a === void 0 ? void 0 : _a.filename}`
        }, {
            where: { stock_seq: stock_seq }
        });
        if (result[0] > 0) {
            res.send('ok');
        }
        else {
            res.send('업데이트 실패');
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.updateStockAfterUploadImg = updateStockAfterUploadImg;
