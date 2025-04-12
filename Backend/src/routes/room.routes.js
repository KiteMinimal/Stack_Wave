
const {Router} = require("express");
const { createRoomcontroller } = require("../controllers/room.controller");
const { userAuth } = require("../middlewares/auth.middleware");
const router = Router();

router.post("/create", userAuth, createRoomcontroller);

module.exports = router;