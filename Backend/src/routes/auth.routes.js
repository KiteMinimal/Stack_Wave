
const {Router} = require("express")
const router = Router();
const { signUpController, loginController, profileController, verifyController } = require("../controllers/auth.controller");
const { userAuth, signUpValidations, loginValidation } = require("../middlewares/auth.middleware");

router.post("/signUp", signUpValidations, signUpController)

router.post("/login", loginValidation, loginController)

router.get("/me", userAuth, profileController)

router.post("/verify", userAuth, verifyController)

module.exports = router;