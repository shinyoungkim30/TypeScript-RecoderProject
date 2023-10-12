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
const middlewares_1 = require("../middlewares");
const auth_1 = require("../controllers/auth");
const router = express_1.default.Router();
router.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.user) {
            const fullUserWithoutPassword = yield models_1.User.findOne({
                where: { user_id: req.user.user_id },
                attributes: {
                    exclude: ['user_pw']
                },
                include: [{
                        model: models_1.Company,
                        include: [{
                                model: models_1.Warehouse,
                                include: [{
                                        model: models_1.Rack
                                    }]
                            }]
                    }]
            });
            res.status(200).json(fullUserWithoutPassword);
        }
        else {
            res.status(200).json(null);
        }
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}));
router.post('/login', middlewares_1.isNotLoggedIn, auth_1.login);
router.post('/', middlewares_1.isNotLoggedIn, auth_1.join);
router.post('/logout', middlewares_1.isLoggedIn, auth_1.logout);
router.post('/checkid', auth_1.checkId);
router.patch('/', middlewares_1.isLoggedIn, auth_1.updateUser);
router.get('/info', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userNick = yield models_1.User.findAll({
        where: { user_seq: (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_seq },
        attributes: ['user_nick'],
        include: [{
                model: models_1.Company,
                attributes: ['com_name'],
            }],
    });
    res.json({ userNick });
}));
exports.default = router;
