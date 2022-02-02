const Cart = require("../cart/cart.model");
const Order = require("./orders.model");

//Function that returns all the orders of a user in MongoDB
const findAllOrdersUser = async (email) => {
  try {
    const orders = await Order.find({ email });
    if (orders.length === 0) {
      return null;
    }
    return orders;
  } catch (error) {
    throw new Error("Error finding all purchase orders");
  }
};

//Function that returns a purchase order from a user in MongoDB
const findOneOrderUser = async (email, ido) => {
  try {
    const order = await Order.find({ email, _id: ido }).populate({
      path: "products",
      populate: { path: "_id", select: "productName price" },
    });
    if (order.length === 0) {
      return null;
    }
    return order[0];
  } catch (error) {
    throw new Error("Error searching for a purchase order");
  }
};

//Function to add a purchase order to MongoDB
const addOneOrder = async (email) => {
  try {
    const cart = await Cart.find({ email });
    if (cart.length !== 0) {
      const { products, address } = cart[0];
      const newOrder = new Order({
        email,
        products,
        address,
      });
      const saveNewOrder = await newOrder.save();
      //We delete the shopping cart once the order has been generated
      await Cart.findOneAndDelete({ email });
      return saveNewOrder;
    }
    return null;
  } catch (error) {
    console.log(error.message);
    throw new Error("Error generating the order");
  }
};

//Function that updates a purchase order in MongoDB
const updateOneOrder = async (email, ido, state) => {
  try {
    const orderUpdate = await Order.findByIdAndUpdate(
      { email, _id: ido },
      { state },
      { new: true }
    ).populate({
      path: "products",
      populate: { path: "_id", select: "productName price" },
    });
    if (!orderUpdate) {
      return null;
    }
    return orderUpdate;
  } catch (error) {
    throw new Error("Error updating order status");
  }
};

//Function that deletes a purchase order in MongoDB
const deleteOneOrder = async (email, ido) => {
  try {
    const orderDelete = await Order.findByIdAndDelete({ email, _id: ido });
    if (orderDelete.deletedCount === 1) {
      return;
    }
    return null;
  } catch (error) {
    throw new Error("Error deleting a purchase order");
  }
};

module.exports = {
  findAllOrdersUser,
  findOneOrderUser,
  addOneOrder,
  updateOneOrder,
  deleteOneOrder,
};
