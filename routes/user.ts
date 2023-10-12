import express, { Request, Response } from 'express';
import { User, Company, Warehouse, Rack } from '../models';

import { isLoggedIn, isNotLoggedIn } from '../middlewares';
import { login, join, logout, checkId, updateUser } from '../controllers/auth';

const router = express.Router()

router.get('/', async (req: Request, res: Response, next) => {
  try {
    if (req.user) {
      const fullUserWithoutPassword = await User.findOne({
        where: { user_id: req.user.user_id },
        attributes: {
          exclude: ['user_pw']
        },
        include: [{
          model: Company,
          include: [{
            model: Warehouse,
            include: [{
                model: Rack
            }]
          }]
        }]
      })
      res.status(200).json(fullUserWithoutPassword);
    } else {
      res.status(200).json(null);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/login', isNotLoggedIn, login);

router.post('/', isNotLoggedIn, join);

router.post('/logout', isLoggedIn, logout);

router.post('/checkid', checkId)

router.patch('/', isLoggedIn, updateUser);

router.get('/info', async (req: Request, res: Response) => {
  const userNick = await User.findAll({
    where: { user_seq: req.user?.user_seq },
    attributes: ['user_nick'],
    include: [{
      model: Company,
      attributes: ['com_name'],
    }],
  })
  res.json({userNick})
})

export default router;