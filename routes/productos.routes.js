const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const config = require("../configs/config");

//CONTROLLERS
const {
  getAllProducts,
  getOneProduct,
  postOneProduct,
  putOneProduct,
  delOneProduct,
} = require("../controllers/products.controller");

const graphqlProducts = () => {
  const schema = buildSchema(`
    type Query {
      allProducts: [Product]
      oneProduct(id: String!): Product
    },
    type Product {
      _id: ID
      title: String!
      price: Float!
      thumbnail: String!
    },
    type Mutation {
      createOneProduct(input: ProductInput): Product
      updateOneProduct(input: ID, ProductInput) : Product
      deleteOneProdcut(input: ID) : Product 
    },
    input ProductInput {
      title: String!
      price: Float!
      thumbnail: String!
    }
    input ID {
      _id: ID
    }
  `);

  const root = {
    allProducts: () => getAllProducts,
    oneProduct: (id) => getOneProduct(id),
    createOneProduct: ({ input }) => postOneProduct(input),
    updateOneProduct: (id) => putOneProduct(id),
    delOneProduct: (id) => delOneProduct(id),
  };

  return graphqlHTTP({
    graphiql: true,
    rootValue: root,
    schema: schema,
    graphiql: config.GRAPHIQL == "true",
  });
};

module.exports = graphqlProducts;
