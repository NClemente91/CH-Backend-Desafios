const faker = require("faker");

faker.locale = "es";

const getFaker = () => ({
  title: faker.name.findName(),
  price: faker.finance.amount(),
  thumbnail: faker.image.food(),
});

module.exports = { getFaker };
