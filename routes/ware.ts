import express, { Request, Response } from 'express';
import { Warehouse, Loading, Rack, Stock } from '../models';

const router = express.Router()

router.post('/', async (req: Request, res: Response) => {
    let { width, length, name, comSeq } = req.body
    try {
        const result = await Warehouse.create({
            wh_name: name,
            wh_width: width,
            wh_length: length,
            com_seq: comSeq
        })
        res.json(result.toJSON())
    } catch (error) {
        console.error(error);
    }
})

router.get('/manage/:com_seq', async (req: Request, res: Response) => {
    let com_seq = req.params.com_seq
    try {
        const warehouseList = await Warehouse.findAll({
            attributes: ['wh_name', 'createdAt', 'wh_seq'],
            where: {
                com_seq : com_seq
            },
            include: [{
                model: Rack,
                include: [{
                    model: Loading,
                    include: [{
                        model: Stock
                    }]
                }]
            }]
        });
        res.json(warehouseList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.get('/wh_name/:com_seq', async (req: Request, res: Response) => {
    try {
        const nameList = await Warehouse.findAndCountAll({
            attributes: ['wh_name'],
            where: {
                com_seq: req.params.com_seq,
            },
            include: [{
                model: Rack,
                attributes: ['rack_seq'],
                include: [{
                    model: Loading,
                    where: {
                        loading_type: 'I'
                    },
                    attributes: ['loading_seq'],
                    include: [{
                        model: Stock,
                        attributes: ['stock_name']
                    }]
                }]
            }]
        })
        res.json(nameList)
    } catch (error) {
        console.error(error);
    }
})

router.get('/shortList/:com_seq', async (req: Request, res: Response) => {
    let com_seq = req.params.com_seq
    try {
        const warehouseList = await Warehouse.findAll({
            attributes: ['wh_name', 'createdAt', 'wh_seq'],
            where: {
                com_seq : com_seq
            },
            include: [{
                model: Rack,
                include: [{
                    model: Loading,
                    include: [{
                        model: Stock
                    }]
                }]
            }],
            limit: 3
        });
        res.json(warehouseList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

export default router;