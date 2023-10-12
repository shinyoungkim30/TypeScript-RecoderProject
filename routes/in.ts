import express, { Request, Response } from "express";
import { Loading, Stock, Client } from "../models";
import { col } from "sequelize";
import multer from "multer";
import path from "path";
import fs from "fs";

import { updateStockAfterUploadImg } from "../controllers/img";

const router = express.Router();

try {
  fs.readdirSync("uploads");
} catch (error) {
  fs.mkdirSync("uploads");
}
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, "uploads");
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
      done(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post("/img", upload.single("file"), updateStockAfterUploadImg);

router.get("/:com_seq/:loading_type", async (req: Request, res: Response) => {
  let com_seq = req.params.com_seq;
  let loading_type = req.params.loading_type;

  let date = "";
  if (loading_type === "O") {
    date = "out_created_at";
  } else {
    date = "created_at";
  }

  try {
    const result = await Loading.findAll({
      where: {
        com_seq: com_seq,
        loading_type: loading_type,
      },
      include: [{
          model: Stock,
          include: [{
            model: Client,
          }],
      }],
      order: [[col(date), "DESC"]],
      limit: 5,
    });
    res.json(result);
  } catch (error) {
    console.error(error);
  }
});

router.get(
  "/cnt/:com_seq/:loading_type",
  async (req: Request, res: Response) => {
    let com_seq = req.params.com_seq;
    let loading_type = req.params.loading_type;

    try {
      const result = await Loading.count({
        where: {
          com_seq: com_seq,
          loading_type: loading_type,
        },
        include: [{
            model: Stock,
            include: [{
              model: Client,
            }],
        }],
      });
      res.json(result);
    } catch (error) {
      console.error(error);
    }
  }
);

router.post("/barcode", async (req: Request, res: Response) => {
  let barcode = req.body.barcode;
  let com_seq = req.body.com_seq;

  try {
    const result = await Stock.findAll({
      where: {
        stock_barcode: barcode,
      },
    });
    let { stock_seq, stock_balance_cnt } = result[0];
    await Loading.create({
      loading_type: null,
      loading_cnt: stock_balance_cnt,
      com_seq: com_seq,
      stock_seq: stock_seq,
    });
    res.send("ok");
  } catch (error) {
    console.error(error);
  }
});

router.post("/create", async (req: Request, res: Response) => {
  const { com_seq } = req.body;

  try {
    const result = await Loading.findAll({
      where: {
        loading_type: null,
        com_seq: com_seq,
      },
      include: [{
        model: Stock,
      }],
    });
    res.json(result);
  } catch (error) {
    console.error(error);
  }
});

router.post("/send/loading", async (req: Request, res: Response) => {
  let { com_seq, stock_seq } = req.body;

  try {
    const result2 = await Loading.update(
      { loading_type: "B" },
      {
        where: {
          stock_seq: stock_seq,
          com_seq: com_seq,
        },
      }
    );
    const io = req.app.get("io");
    io.of("/in").emit("updateIn", "입고등록완료");
    res.json(result2);
  } catch (error) {
    console.log(error);
  }
});

router.post("/get/loading", async (req: Request, res: Response) => {
  let com_seq = req.body.com_seq;

  try {
    console.log("in_02 : com_seq", com_seq);

    const result = await Loading.findAll({
      where: {
        loading_type: "B",
        com_seq: com_seq,
      },
      include: [{
        model: Stock,
      }],
    });
    res.json(result);
  } catch (error) {
    console.log(error);
  }
});

router.post("/del/loaing", async (req: Request, res: Response) => {
  let stock_seq = req.body.stock_seq;
  try {
    const result = await Loading.update(
      {
        loading_type: null,
      },
      {
        where: {
          stock_seq: stock_seq,
        },
        include: [{
          model: Stock,
        }],
      }
    );
    const io = req.app.get("io");
    io.of("/in").emit("updateIn", "입고취소완료");
    res.json(result);
  } catch (error) {
    console.log("입고취소 에러", error);
  }
});

router.post("/loading", async (req: Request, res: Response) => {
  let {
    rack_seq,
    loading_seq,
    loading_floor,
    loading_position,
    loading_manager,
    com_seq,
  } = req.body;
  try {
    const result2 = await Loading.update(
      {
        loading_type: "I",
        rack_seq: rack_seq,
        loading_floor: loading_floor,
        loading_position: loading_position,
        loading_manager: loading_manager,
      },
      {
        where: {
          loading_seq: loading_seq,
          com_seq: com_seq,
        },
      }
    );
    res.json(result2);
  } catch (error) {
    console.log(error);
  }
});

router.patch("/position", async (req: Request, res: Response) => {
  let { stock_seq, x, z, y, rack_seq } = req.body;
  let loading_floor = parseInt(y);
  let loading_position = [x, z].join(",");
  try {
    await Loading.update(
      {
        loading_type: "I",
        loading_floor: loading_floor,
        loading_position: loading_position,
        rack_seq: rack_seq,
      },
      {
        where: { stock_seq: stock_seq },
      }
    );
    const io = req.app.get("io");
    io.of("/in").emit("updateIn", "입고완료");
    res.send("ok");
  } catch (error) {
    console.error(error);
  }
});

export default router;
