const Creature = require("../models/Creature");
const mongoose = require('mongoose');

exports.getAll = () => {
  return Creature.find();
};

exports.getOne = id => {
  const isValidObjectId = mongoose.isValidObjectId(id);
  if (!isValidObjectId) {
    throw new Error('Invalid post ID')
  }
  const creature = Creature.findById(id).populate("owner");
  return creature;
};

exports.createCreature = creatureData => {
  return Creature.create(creatureData);
};

exports.updateOne = (creatureId, creatureData) => {
  const post = Creature.findByIdAndUpdate(creatureId, creatureData, { new: true });
  return post;
};

exports.getVotes = async creatureId => {
  return await Creature.findById(creatureId).populate("votes.userId");
};

exports.delete = creatureId => {
  return Creature.findByIdAndDelete(creatureId);
};

exports.addVote = async (creatureId, userId) => {
  const creatureData = await Creature.findById(creatureId);

  console.log(creatureData.votes);

  creatureData.votes.push(userId);

  return creatureData.save();
};

exports.getByOwner = (userId) => {
  return Creature.find({owner: userId})
}
