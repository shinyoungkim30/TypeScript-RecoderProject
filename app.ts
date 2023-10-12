import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import session from 'express-session';
import dotenv from 'dotenv';
import passport from 'passport';
import cors from 'cors';

dotenv.config()
import outRouter from './routes/out';
import userRouter from './routes/user';
import comRouter from './routes/company';
import rackRouter from './routes/rack';
import inRouter from './routes/in';
import noticeRouter from './routes/notice';
import stockRouter from './routes/stock';
import wareRouter from './routes/ware';
import warehouseRouter from './routes/warehouse';
import { sequelize } from './models';
import passportConfig from './passport';
import webSocket from './socket';

const app = express()
passportConfig()
app.set('port', process.env.PORT || 8000)

sequelize.sync({ force: false })
.then(() => {
    console.log('데이터베이스 연결 성공');
})
.catch((err) => {
    console.error(err);
})

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))
app.use(morgan('dev'))
app.use(express.static(path.join(__dirname, 'public')))
app.use('/img', express.static(path.join(__dirname, 'uploads')))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET!,
    cookie: {
        httpOnly: true,
        secure: false
    }
}))
app.use(passport.initialize())
app.use(passport.session())

app.use('/user', userRouter)
app.use('/out', outRouter)
app.use('/company', comRouter)
app.use('/in', inRouter)
app.use('/notice', noticeRouter)
app.use('/ware', wareRouter)
app.use('/rack', rackRouter)
app.use('/warehouse', warehouseRouter)
app.use('/stock', stockRouter)

const server = app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
})

webSocket(server, app);

export default app;