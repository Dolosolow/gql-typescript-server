import { Router } from "express";

import { User } from "../entity/User";
import redis from "../utils/redisConfig";

const router = Router();

router.get("/confirm/:id", async (req, res) => {
  const { id } = req.params;
  const userId = await redis.get(id);

  if (userId) {
    await User.update({ id: userId }, { confirmed: true });
    await redis.del(id);
    res.send("ok");
  } else {
    res.send("invalid");
  }
});

export default router;
