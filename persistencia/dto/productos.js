const productDTO = (prod) => {
  const newProduct = {
    id: Math.random().toString(36).substring(0, 10),
    title: prod.title,
    price: prod.price,
    thumbnail: prod.thumbnail,
    fyh: new Date().toLocaleString(),
  };
  return newProduct;
};

module.exports = {
  productDTO,
};
