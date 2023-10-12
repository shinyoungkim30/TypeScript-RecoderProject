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
exports.updateUser = exports.checkId = exports.logout = exports.login = exports.join = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const passport_1 = __importDefault(require("passport"));
const models_1 = require("../models");
const join = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('요청');
    let { user_id, user_pw, user_nick } = req.body;
    try {
        const exUser = yield models_1.User.findOne({
            where: {
                user_id: user_id,
            }
        });
        if (exUser) {
            return res.status(403).send('이미 사용 중인 아이디입니다.');
        }
        const hashedPassword = yield bcrypt_1.default.hash(user_pw, 12);
        yield models_1.User.create({
            user_id: user_id,
            user_pw: hashedPassword,
            user_nick: user_nick,
        });
        res.status(201).send('ok');
    }
    catch (error) {
        console.error(error);
        next(error); // status 500
    }
});
exports.join = join;
const login = (req, res, next) => {
    passport_1.default.authenticate('local', (err, user, info) => {
        if (err) {
            console.error(err);
            return next(err);
        }
        if (info) {
            return res.status(401).send(info);
        }
        return req.login(user, (loginErr) => __awaiter(void 0, void 0, void 0, function* () {
            if (loginErr) {
                console.error(loginErr);
                return next(loginErr);
            }
            const fullUserWithoutPassword = yield models_1.User.findOne({
                where: { user_id: user.user_id },
                attributes: {
                    exclude: ['user_pw']
                },
                include: [{
                        model: models_1.Company
                    }]
            });
            return res.status(200).json(fullUserWithoutPassword);
        }));
    })(req, res, next);
};
exports.login = login;
const logout = (req, res, next) => {
    req.logout(err => {
        if (err) {
            return next(err);
        }
        else {
            res.send('ok');
        }
    });
};
exports.logout = logout;
const checkId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const checkId = yield models_1.User.findOne({
            where: { user_id: req.body.id }
        });
        if (checkId === null) {
            res.send('회원가입 가능');
        }
        else {
            res.send('아이디 중복');
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.checkId = checkId;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { currentPW, newPW, nick } = req.body;
    try {
        const result = yield bcrypt_1.default.compare(currentPW, req.user.user_pw);
        if (result) {
            if (newPW) {
                const hashedPassword = yield bcrypt_1.default.hash(newPW, 12);
                if (nick) {
                    yield models_1.User.update({
                        user_pw: hashedPassword,
                        user_nick: nick
                    }, {
                        where: {
                            user_id: req.user.user_id
                        }
                    });
                    res.send('ok');
                }
                else {
                    yield models_1.User.update({
                        user_pw: hashedPassword,
                        user_nick: req.user.user_nick
                    }, {
                        where: {
                            user_id: req.user.user_id
                        }
                    });
                    res.send('ok');
                }
            }
            else {
                res.send('새로운 비밀번호를 입력하세요.');
            }
        }
        else {
            res.send('기존 비밀번호가 일치하지 않습니다.');
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.updateUser = updateUser;
