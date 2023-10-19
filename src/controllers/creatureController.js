const router = require("express").Router();
const creatureService = require("../services/creatureService");
const { getErrorMessage } = require("../utils/errorHelpers");
const { getLeanEmails } = require('../utils/getEmails');
const { isAuth } = require('../middlewares/authMiddleware')

///////////////// Catalog
router.get("/", async (req, res) => {
  const posts = await creatureService.getAll().lean();

  res.render("creatures/catalog", { posts });
});

////////////////// Create
router.get("/create", isAuth, (req, res) => {
  res.render("creatures/create");
});

router.post("/create", isAuth, async (req, res) => {
  const creatureData = {
    ...req.body,
    owner: req.user._id
  };
  try {
    await creatureService.createCreature(creatureData);
    res.redirect("/creatures");
  } catch (err) {
    console.log(err);
    res.render("creatures/create", { error: getErrorMessage(err) });
  }
});

///////////////////////////// Details

router.get('/details/:creatureId', async (req, res) => {
    const creatureId = req.params.creatureId;
    
    try{
        const creatureData = await creatureService.getOne(creatureId)
        .populate('votes.userId')
        .lean();

        // 12 bit check
        if(!creatureData){
          res.redirect("/404")
        }
        console.log(creatureData)

        const isOwner = req.user?._id == creatureData.owner._id;

        const votedUsers = getLeanEmails(creatureData.votes);

        console.log(votedUsers)

        const isVote = votedUsers.includes(req.user?.email)
        // console.log(isVote);

        res.render('creatures/details', {...creatureData, isOwner, isVote, votes: creatureData.votes.length , votedUsers})
    }catch(err){
        console.log(err);
        res.render('404', {error: getErrorMessage(err)})
    }
})

////////////////// Edit

router.get('/details/edit/:creatureId', isAuth, async (req, res) =>{
  const creatureId = req.params.creatureId;
  console.log(creatureId)
  try{
    const creatureData = await creatureService.getOne(creatureId).lean();
    console.log(creatureData)
    if (req.user._id == creatureData.owner._id) {
      res.render("creatures/edit", { creatureData });
    } else {
      res.redirect("/404");
    }
  }catch(err){
    console.log('edit error');
    
    console.log(err);
    res.render('creatures/edit', {error: getErrorMessage(err)})
  }
})

router.post('/details/edit/:creatureId', isAuth, async (req, res) =>{
  const creatureId = req.params.creatureId;
  const creatureData = req.body;
  try{
    const updatedCreature = await creatureService.updateOne(creatureId, creatureData);
    await updatedCreature.save();
     res.redirect(`/creatures/details/${creatureId}`);
    
  }catch(err){
    console.log('edit post error');
    
    console.log(err);
                                  //render the failed attempt data
    res.render('creatures/edit', { creatureData, error: getErrorMessage(err)})
  }
})

//////////////////////// Delete
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
////////////////////////// Votes

router.get('/votes/:creatureId', isAuth, async (req, res) => {
  const creatureId = req.params.creatureId;
  const userId = req.user._id;

  await creatureService.addVote(creatureId, { userId } );

  res.redirect(`/creatures/details/${creatureId}`);
})

module.exports = router;
