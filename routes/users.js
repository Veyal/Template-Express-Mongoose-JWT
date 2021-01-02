const router = require("express").Router();

const middlewares = require("../middlewares/main")

const userController = require("../controllers/users");


router.post("/first-register", [middlewares.requiredParams(["username","password"])], userController.createFirstUser);
router.post("/register", [middlewares.authenticated, middlewares.requiredParams(["username","password"])], userController.create);
router.post("/login", middlewares.requiredParams(["username","password"]), userController.authenticate);
router.post("/change-pass", middlewares.authenticated, userController.changePass)
module.exports = router;