import express, { Request, Response } from "express";
import { Rack, Loading, Stock } from "../models";

interface RackItem {
  rackName: string;
  rackWidth: number;
  rackLength: number;
  rackFloor: number;
  rackX: number;
  rackZ: number;
  rackRotationYN: string;
  wh_seq: number;
}

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const items: RackItem[] = req.body
    const arr = items.map((item) => ({
      rack_id: item.rackName,
      rack_position: "",
      rack_width: item.rackWidth,
      rack_length: item.rackLength,
      rack_floor: item.rackFloor,
      rack_x: item.rackX,
      rack_z: item.rackZ,
      rack_rotate_yn: item.rackRotationYN,
      wh_seq: item.wh_seq,
    }));
    await Rack.bulkCreate(arr);
    res.send("창고 생성 성공");
  } catch (error) {
    console.error(error);
  }
});

router.get("/:wh_seq", async (req: Request, res: Response) => {
  console.log("qwe");
  let wh_seq = req.params.wh_seq;
  try {
    const rackList = await Rack.findAll({
      where: {
        wh_seq: wh_seq,
      },
      include: [{
        model: Loading,
        include: [{
          model: Stock,
        }],
      }],
    });
    res.json(rackList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;