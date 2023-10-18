const router = require("express").Router();
const creatureService = require("../services/creatureService");
const { getErrorMessage } = require("../utils/errorHelpers");
const { getLeanEmails } = require('../utils/getEmails');
const { isAuth } = require('../middlewares/authMiddleware')

router.get("/", async (req, res) => {
  const posts = await creatureService.getAll().lean();

  res.render("creatures/catalog", { posts });
});

router.get("/create", isAuth, (req, res) => {
  res.render("creatures/create");
});

router.post("/create", isAuth, async (req, res) => {
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
    console.log(creatureId);
    
    
    
    try{
        const creatureData = await creatureService.getOne(creatureId).populate('votes.userId').lean();

        console.log(creatureData)

        const isOwner = req.user?._id == creatureData.owner._id;

        const votedUsers = getLeanEmails(creatureData.votes);

        console.log(votedUsers)

        const votesArr = votedUsers.split(', ');

        const votes = votesArr.length;
        console.log(votes);

        const hasVotes = votes > 0;

        const isVote = votedUsers.includes(req.user.email)
        // console.log(isVote);

        res.render('creatures/details', {...creatureData, isOwner, isVote, votesCount: votes, hasVotes, votedUsers})
    }catch(err){
        console.log(err);
    }
})

router.get('/votes/:creatureId', isAuth, async (req, res) => {
  const creatureId = req.params.creatureId;
  const userId = req.user._id;

  await creatureService.addVote(creatureId, { userId } );

  res.redirect(`/creatures/details/${creatureId}`);
})

 router.get('/details/delete/:creatureId', async (req, res) => {
  const creatureId = req.params.creatureId;
  try {
    const creatureData = await creatureService.getOne(creatureId)
    
    // Route Guard
    if(req.user._id == creatureData.owner._id){
      await creatureService.delete(creatureId);
      res.redirect('/creatures')
    }

  } catch (err) {
    console.log(err)
    res.render(`/creatures/details/${creatureId}`, {error: 'Unssuccesful attempt to delete post.'})
  }

 })

module.exports = router;
