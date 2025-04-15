
const {Router} = require("express");
const { userAuth } = require("../middlewares/auth.middleware");
const { addAnswerController, editAnswerController, deleteAnswerController, upVoteAnswerController, downVoteAnswerController } = require("../controllers/answer.controller");
const router = Router();

router.post("/:questionId", userAuth, addAnswerController);

router.put("/:answerId", userAuth, editAnswerController);

router.delete("/:answerId", userAuth, deleteAnswerController);

router.post("/:answerId/upVote", userAuth, upVoteAnswerController);

router.post("/:answerId/downVote", userAuth, downVoteAnswerController);


module.exports = router;