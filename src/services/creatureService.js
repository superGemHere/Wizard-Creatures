const Creature = require("../models/Creature");


exports.getAll = () => {
    return Creature.find();
}

exports.getOne = (id) => {
    return Creature.findById(id).populate('owner');
}

exports.createCreature = (creatureData) => {
    return Creature.create(creatureData);

}

exports.getVotes = async(creatureId) => {
    return await Creature.findById(creatureId).populate('votes.userId');
   
}

exports.addVote = async (creatureId, userId) => {
 const creatureData =  await Creature.findById(creatureId);

 console.log(creatureData.votes)

 creatureData.votes.push(userId);

 return creatureData.save();
}
