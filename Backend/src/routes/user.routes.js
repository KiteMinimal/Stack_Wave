
const {Router} = require("express");
const { findUserController, updateUserController, leaderBoardController } = require("../controllers/user.controller");
const { userAuth } = require("../middlewares/auth.middleware");
const router = Router();


router.get("/:id", userAuth, findUserController)     // get user profile

router.put("/:id", userAuth, updateUserController)   // update user profile

router.get("/leaderboard", userAuth, leaderBoardController)   // Leaderboard data


module.exports = router;
