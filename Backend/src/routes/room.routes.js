
const {Router} = require("express");
const { createRoomcontroller, findRoomsController } = require("../controllers/room.controller");
const { userAuth } = require("../middlewares/auth.middleware");
const router = Router();

router.post("/create", userAuth, createRoomcontroller);

router.get("/find", userAuth, findRoomsController)

module.exports = router;