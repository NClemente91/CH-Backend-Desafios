const axios = require("axios");

const url = "http://localhost:5000/api/productos";

const findAllProduct = async () => {
  try {
    const response = await axios.get(`${url}/listar`);
    console.log(response.data);
  } catch (error) {
    console.log(error.data);
  }
};

const findOneProductbyID = async (id) => {
  try {
    const response = await axios.get(`${url}/listar/${id}`);
    console.log(response.data);
  } catch (error) {
    console.log(error.data);
  }
};

const createProduct = async (product) => {
  try {
    const response = await axios.post(`${url}/guardar`, product);
    console.log(response.data);
  } catch (error) {
    console.log(error.data);
  }
};

const updateOneProduct = async (id) => {
  try {
    const response = await axios.put(`${url}/actualizar/${id}`);
    console.log(response.data);
  } catch (error) {
    console.log(error.data);
  }
};

const deleteOneProduct = async (id) => {
  try {
    const response = await axios.delete(`${url}/borrar/${id}`);
    console.log(response.data);
  } catch (error) {
    console.log(error.data);
  }
};

findAllProduct();

findOneProductbyID("619397a809b805eebab92eaf");

createProduct({
  title: "Pera",
  price: 25,
  thumbnail: "ujkhgrfhkwesfuhbrkw",
});

updateOneProduct("619397a809b805eebab92eaf");

deleteOneProduct("619397a809b805eebab92eaf");
