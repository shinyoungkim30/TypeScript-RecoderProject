import express, { Request, Response } from 'express';
import { Warehouse } from '../models';

const router = express.Router()

router.get('/:wh_seq', async (req: Request, res: Response) => {
    let wh_seq = req.params.wh_seq
    try {
        const warehouseList = await Warehouse.findOne({
            attributes: ['wh_width', 'wh_length'],
            where: {
                wh_seq : wh_seq
            },
        });
        res.json(warehouseList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.delete('/:wh_seq', async (req: Request, res: Response) => {
    try {
        const result = await Warehouse.destroy({
            where: {
                wh_seq: req.params.wh_seq
            }
        })
        res.json(result)
    } catch (error) {
        console.error(error);
    }
})

router.get('/wh_name/:com_seq', async (req: Request, res: Response) => {
    try {
        const wareNameList = await Warehouse.findAll({
            where: { com_seq: req.params.com_seq },
            attributes: ['wh_name'],
        })
        res.json(wareNameList)
    } catch (error) {
        console.error(error);
    }
})

export default router;