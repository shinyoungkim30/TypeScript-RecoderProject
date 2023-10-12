import express, { Request, Response } from 'express';
import { Client, Loading, Rack, Stock, Warehouse } from '../models';

const router = express.Router()

router.post('/barcode', async (req: Request, res: Response) => {
  let { stock_name, stock_kind, stock_price, stock_barcode, stock_expired, stock_balance_cnt} = req.body;

  try {
    const stock_expired_date = new Date(stock_expired);
    await Stock.create({
      stock_name: stock_name,
      stock_kind: stock_kind,
      stock_price: stock_price,
      stock_barcode: stock_barcode,
      stock_expired: stock_expired_date,
      stock_balance_cnt: stock_balance_cnt,
      stock_img: '',
    })
    res.send('ok')
  } catch (error) {
    console.error(error);
  }
})

router.get('/:com_seq', async (req: Request, res: Response) => {
  let com_seq = req.params.com_seq
  try {
    const result = await Loading.findAndCountAll({
      where: {
        com_seq: com_seq,
        loading_type: 'I',
      },
      include: [{
        model: Stock,
        include: [{
          model: Client
        }]
      }]
    })
    res.json(result)
  } catch (error) {
    console.error(error);
  }
})

router.get('/:com_seq/:limit/:offset', async (req: Request, res: Response) => {
  let com_seq = req.params.com_seq
  let limit = parseInt(req.params.limit)
  let offset = parseInt(req.params.offset)

  try {
    const result = await Loading.findAll({
      where: {
        com_seq: com_seq,
        loading_type: 'I',
      },
      include: [{
        model: Stock,
        include: [{
          model: Client
        }]
      }],
      offset: (offset - 1) * limit,
      limit: limit,
    })
    res.json(result)
  } catch (error) {
    console.error(error);
  }
})

router.get('/show/:wh_seq', async (req: Request, res: Response) => {
  try {
    const stockList = await Warehouse.findAll({
      attributes: ['wh_seq'],
      include: [{
        model: Rack,
        include: [{
          model: Loading,
          include:[{
            model: Stock
          }]
        }]
      }],
      where:{
        wh_seq: req.params.wh_seq,
      }
    })
    res.json(stockList)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

router.get('/stockcount/:wh_seq', async (req: Request, res: Response) => {
  try {
    const result = await Warehouse.findAndCountAll({
      where: {
        wh_seq: parseInt(req.params.wh_seq)
      },
      include: [{
        model: Rack,
        include: [{
          model: Loading
        }]
      }]
    })
    res.send(`${result.count}`)
  } catch (error) {
    console.error(error);
  }
})

router.get('/ware/:stock_seq', async (req: Request, res: Response) => {
  try {
    const result = await Stock.findOne({
      where: { stock_seq: req.params.stock_seq },
      include: { model: Loading }
    })
    res.json(result)
  } catch (error) {
    console.error(error);
  }
})

export default router;