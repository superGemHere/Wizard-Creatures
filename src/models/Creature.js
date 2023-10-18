const mongoose = require("mongoose");


const creatureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true,"Name name is required !"],
    minLenght: [2, 'Name must be atleast 2 characters long.']
  },
  species: {
    type: String,
    required: [true,"Specie name is required !"],
    minLenght: [3, 'Specie name must be atleast 3 characters long.']
  },
  imageUrl: {
    type: String,
    required: [true,"ImageUrl is required !"],
    match: [/^(http|https):\/\//, "Image url should start with \" http://\" or \"https://\""],
  },
  skinColor: {
    type: String,
    required: [true,"Skin color is required !"],
    minLenght: [3, 'Skin color must be atleast 3 characters long.']
  },
  eyeColor: {
    type: String,
    required: [true,"Eye color is required !"],
    minLenght: [3, 'Eye color must be atleast 3 characters long.']
  },
  description: {
    type: String,
    required: [true,"Description is required !"],
    minLenght: [5, 'Description must be atleast 3 characters long.'],
    maxLenght: [500, 'Description cannot pass 500 characters.']
  },
  owner: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  }
});



const Creature = mongoose.model("Creature", creatureSchema);

module.exports = Creature;