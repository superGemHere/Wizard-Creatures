const router = require("express").Router();
const creatureService = require("../services/creatureService");
const { getErrorMessage } = require("../utils/errorHelpers");
const { getLeanEmails } = require('../utils/getEmails')

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
        const creatureData = await creatureService.getOne(creatureId).populate('votes.userId').lean();
        const isOwner = req.user?._id == creatureData.owner?._id;

        const votedUsers = getLeanEmails(creatureData.votes);
        const isVote = votedUsers.includes(req.user.email)
        console.log(isVote);
        // const isVote = voted 

        res.render('creatures/details', {...creatureData, isOwner, isVote})
    }catch(err){
        console.log(err);
    }
})

router.get('/votes/:creatureId', async (req, res) => {
  const creatureId = req.params.creatureId;
  const userId = req.user._id;

  await creatureService.addVote(creatureId, { userId } );

  res.redirect(`/creatures/details/${creatureId}`);
})

module.exports = router;
