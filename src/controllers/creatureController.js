const router = require("express").Router();
const creatureService = require("../services/creatureService");
const { getErrorMessage } = require("../utils/errorHelpers");

router.get("/", async (req, res) => {
  const posts = await creatureService.getAll().lean();

  res.render("creatures/catalog", { posts });
});

router.get("/create", (req, res) => {
  res.render("creatures/create");
});

router.post("/create", async (req, res) => {
  const creatureData = {
    ...req.body,
    owner: req.user._id
  };
  console.log(creatureData);
  try {
    await creatureService.createCreature(creatureData);
    res.redirect("/creatures");
  } catch (err) {
    console.log(err);
    res.render("creatures/create", { error: getErrorMessage(err) });
  }
});

router.get('/details/:creatureId', async (req, res) => {
    const creatureId = req.params.creatureId;
    console.log('here');
    
    
    try{
        console.log(creatureId)
        const creatureData = await creatureService.getOne(creatureId).lean();
        const isOwner = req.user?._id == creatureData.owner?._id;
        console.log(creatureData);
        res.render('creatures/details', {...creatureData, isOwner})
    }catch(err){
        console.log(err);
    }
})

module.exports = router;
