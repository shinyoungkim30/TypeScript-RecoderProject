"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const express_session_1 = __importDefault(require("express-session"));
const dotenv_1 = __importDefault(require("dotenv"));
const passport_1 = __importDefault(require("passport"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const out_1 = __importDefault(require("./routes/out"));
const user_1 = __importDefault(require("./routes/user"));
const company_1 = __importDefault(require("./routes/company"));
const rack_1 = __importDefault(require("./routes/rack"));
const in_1 = __importDefault(require("./routes/in"));
const notice_1 = __importDefault(require("./routes/notice"));
const stock_1 = __importDefault(require("./routes/stock"));
const ware_1 = __importDefault(require("./routes/ware"));
const warehouse_1 = __importDefault(require("./routes/warehouse"));
const models_1 = require("./models");
const passport_2 = __importDefault(require("./passport"));
const socket_1 = __importDefault(require("./socket"));
const app = (0, express_1.default)();
(0, passport_2.default)();
app.set('port', process.env.PORT || 8000);
models_1.sequelize.sync({ force: false })
    .then(() => {
    console.log('데이터베이스 연결 성공');
})
    .catch((err) => {
    console.error(err);
});
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use('/img', express_1.default.static(path_1.default.join(__dirname, 'uploads')));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)(process.env.COOKIE_SECRET));
app.use((0, express_session_1.default)({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false
    }
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use('/user', user_1.default);
app.use('/out', out_1.default);
app.use('/company', company_1.default);
app.use('/in', in_1.default);
app.use('/notice', notice_1.default);
app.use('/ware', ware_1.default);
app.use('/rack', rack_1.default);
app.use('/warehouse', warehouse_1.default);
app.use('/stock', stock_1.default);
const server = app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});
(0, socket_1.default)(server, app);
exports.default = app;
