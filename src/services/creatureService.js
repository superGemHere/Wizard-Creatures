const Creature = require("../models/Creature");


exports.getAll = () => {
    return Creature.find();
}

exports.getOne = (id) => {
    return Creature.find(id);
}

exports.createCreature = (creatureData) => {
    return Creature.create(creatureData);

}
