const Cart = require("../cart/cart.model");
const Order = require("./orders.model");

//METODO PARA LISTAR TODAS LAS ORDENES DE UN USUARIO
const findAllOrdersUser = async (email) => {
  try {
    const orders = await Order.find({ email });
    if (!orders) {
      return null;
    } else {
      return orders;
    }
  } catch (error) {
    throw new Error("Error al encontrar todas las ordenes de compra");
  }
};

//METODO PARA LISTAR UNA ORDEN DE UN USUARIO POR SU ID
const findOneOrderUser = async (email, ido) => {
  try {
    const order = await Order.find({ email, _id: ido });
    if (!order) {
      return null;
    } else {
      return order[0];
    }
  } catch (error) {
    throw new Error("Error al listar una orden de compra");
  }
};

//METODO PARA INCORPORAR UNA ORDEN
const addOneOrder = async (email) => {
  try {
    const cart = await Cart.find({ email });
    if (cart.length !== 0) {
      const { products, address } = cart[0];
      const newOrder = await Order.create({
        email,
        products,
        address,
      });
      //BORRAMOS EL CARRITO UNA VEZ GENERADA LA ORDEN
      await Cart.findOneAndDelete({ email });
      return newOrder;
    }
    return null;
  } catch (error) {
    throw new Error("Error al generar la orden");
  }
};

//METODO PARA MODIFICAR EL ESTADO UNA ORDEN
const updateOneOrder = async (email, ido, state) => {
  try {
    const orderUpdate = await Order.findByIdAndUpdate(
      { email, _id: ido },
      { state },
      { new: true }
    );
    return orderUpdate;
  } catch (error) {
    throw new Error("Error al actualizar el estado de la orden");
  }
};

//METODO PARA BORRAR UNA ORDEN
const deleteOneOrder = async (email, ido) => {
  try {
    const orderDelete = await Order.findByIdAndDelete({ email, _id: ido });
    return orderDelete;
  } catch (error) {
    throw new Error("Error al borrar una orden");
  }
};

module.exports = {
  findAllOrdersUser,
  findOneOrderUser,
  addOneOrder,
  updateOneOrder,
  deleteOneOrder,
};
