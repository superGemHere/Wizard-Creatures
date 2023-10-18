const constants = {
  CLIENT__PORT: 3000,
  // REMINDER ! Change with new DB collection
  CONNECTION__DB: "mongodb://localhost:27017/wizardCreatures",
  // bcrypt salt rounds
  SALT_ROUNDS: 10,
  SECRET_JWT: "ceae6d689dbdccdb82d1e75ba30a8b4d4d890b370f985166958324e68c55d91f",
};

module.exports = constants;
