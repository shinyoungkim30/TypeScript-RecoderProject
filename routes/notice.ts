import express, { Request, Response } from "express";
import { Notice, Loading, Stock, sequelize } from "../models";
import { Op, fn, col } from 'sequelize';

const router = express.Router();

router.post("/alarm", async (req: Request, res: Response) => {
  let user_seq = req.body.user_seq;
  try {
    const result = await Notice.findAll({
      attributes: ["notice_content", "notice_seq"],
      include: [
        {
          model: Stock,
          attributes: ["stock_name"],
          include: [
            {
              model: Loading,
              attributes: [],
            },
          ],
        },
      ],
      where: {
        user_seq: user_seq,
      },
    });
    res.json(result);
  } catch (error) {
    console.error("오류:", error);
    res.status(500).json({ error: "서버 오류" });
  }
});

router.post("/change", async (req: Request, res: Response) => {
  let { user_seq, stock_name, notice_content } = req.body;
  try {
    const result = await Notice.findOne({
      attributes: ["notice_content", "notice_seq"],
      include: [
        {
          model: Stock,
          attributes: ["stock_name"],
          where: { stock_name: stock_name },
          include: [
            {
              model: Loading,
              attributes: [],
            },
          ],
        },
      ],
      where: {
        user_seq: user_seq,
      },
    });

    if (!result) {
      return res.status(404).json({ error: "해당 알림을 찾을 수 없습니다." });
    }

    const notice_seq = result.notice_seq;
    await Notice.update(
      {
        notice_content: notice_content,
      },
      {
        where: {
          notice_seq: notice_seq,
        },
      }
    );

    res.json({ success: true, message: "알림 내용이 업데이트되었습니다." });
  } catch (error) {
    console.error("오류:", error);
    res.status(500).json({ error: "서버 오류" });
  }
});

router.post("/list", async (req: Request, res: Response) => {
  try {
    const com_seq = req.body.com_seq;

    const result = await sequelize.query(`
              SELECT DISTINCT s.stock_name FROM stock AS s
            JOIN loading AS l ON l.stock_seq = s.stock_seq
              WHERE l.loading_type = 'I'  AND l.com_seq = ${com_seq}
            `);

    res.json(result);
  } catch (error) {
    console.error("오류:", error);
    res.status(500).json({ error: "서버 오류" });
  }
});

router.post("/create", async (req: Request, res: Response) => {
  let { com_seq } = req.body;
  try {
    const result = await Loading.findAll({
      attributes: [[fn("SUM", col("loading_cnt")), "total_loading_cnt"]],
      where: {
        com_seq: com_seq,
        [Op.or]: [
          { loading_type: "I" },
          // { loading_type: 'O' }
        ],
      },
      include: [
        {
          model: Stock,
          attributes: ["stock_name", "stock_name"],
        },
      ],
      group: "stock_name",
    });
    res.json(result);
  } catch (error) {
    console.error(error);
  }
});

export default router;
