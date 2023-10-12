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
const passport_1 = __importDefault(require("passport"));
const localStrategy_1 = __importDefault(require("./localStrategy"));
const user_1 = __importDefault(require("../models/user"));
exports.default = () => {
    passport_1.default.serializeUser((user, done) => {
        done(null, user.user_id);
    });
    passport_1.default.deserializeUser((user_id, done) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield user_1.default.findOne({ where: { user_id } });
            done(null, user); // req.user
        }
        catch (error) {
            console.error(error);
            done(error);
        }
    }));
    (0, localStrategy_1.default)();
};
