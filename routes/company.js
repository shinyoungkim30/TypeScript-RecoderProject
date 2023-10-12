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
router.get('/:comNum', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const removeHyphens = req.params.comNum.replaceAll('-', '');
        const result = yield models_1.Company.findAll({
            where: {
                com_business_num: removeHyphens
            }
        });
        console.log(result);
        res.json(result);
    }
    catch (error) {
        console.error(error);
    }
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { com_business_num, com_name, com_address, com_tel } = req.body;
        if (com_name && com_business_num) {
            const result = yield models_1.Company.findOne({
                where: { com_business_num: com_business_num }
            });
            if (!result) {
                const result2 = yield models_1.Company.create({
                    com_business_num: com_business_num,
                    com_name: com_name,
                    com_address: com_address,
                    com_tel: com_tel,
                });
                yield models_1.User.update({
                    com_seq: result2.com_seq
                }, {
                    where: {
                        user_seq: req.user.user_seq
                    }
                });
                res.send('ok');
            }
            else {
                res.send('이미 등록된 기업입니다.');
            }
        }
        else {
            res.send('기업명 또는 사업자등록번호를 입력해주세요.');
        }
    }
    catch (error) {
        console.error(error);
    }
}));
exports.default = router;
