
const { Router } = require("express");
const router = Router();

router.get("/:answerId");

router.post("/:answerId");

router.put("/:commentId");

router.delete("/:commentId");

module.exports = router;