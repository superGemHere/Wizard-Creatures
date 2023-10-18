const router = require("express").Router();

const homeController = require("./controllers/homeController.js");
const userController = require("./controllers/userController.js");
const creatureController = require('./controllers/creatureController.js')

router.use(homeController);
router.use("/users", userController);
router.use('/creatures', creatureController);
// router.get("*", (req,res) =>{
//     res.redirect("/404")
// })

module.exports = router;
