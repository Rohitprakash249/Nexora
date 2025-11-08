const express = require("express");
const bodyParser = require("express");
const cors = require("cors");
const app = express();
const corsOptions = {
  origin: "http://localhost:5173", // List of allowed domains
  credentials: true, // Allow cookies to be sent and received
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  "Content-Type": "application/json"
};
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors(corsOptions));
// Mock product data
let products = [
  {
    id: 1,
    name: "Classic White T-Shirt",
    price: 199.9,
    imageLink: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSOqsARSg_LcoknC-do7jr1wbI9qDuE4vhb_0g7Yl4mPdkdxQsyTSe9asnyFEClGM-vJQ7pi1IVIEzJesHq1s3GN0kRq4yyp3QFQhUQp7y3k4HRKZ0sVQf0"
  },
  {
    id: 2,
    name: "Denim Jeans",
    price: 499.9,
    imageLink: "https://images.unsplash.com/photo-1592595293637-8557fa6d3c64?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=500"
  },
  {
    id: 3,
    name: "Hooded Sweatshirt",
    price: 349.9,
    imageLink: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&w=500&q=80"
  },
  {
    id: 4,
    name: "Leather Jacket",
    price: 899.9,
    imageLink: "https://images.unsplash.com/photo-1516641398641-4c3b519eead9?auto=format&w=500&q=80"
  },
  {
    id: 5,
    name: "Plaid Flannel Shirt",
    price: 279.9,
    imageLink: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&w=500&q=80"
  },
  {
    id: 6,
    name: "Black Dress Pants",
    price: 399.9,
    imageLink: "https://images.unsplash.com/photo-1469398715555-76331a09043c?auto=format&w=500&q=80"
  },
  {
    id: 7,
    name: "Cotton Polo Shirt",
    price: 249.9,
    imageLink: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&w=500&q=80"
  },
  {
    id: 8,
    name: "Summer Shorts",
    price: 219.9,
    imageLink: "https://images.unsplash.com/photo-1512436991641-dc1d9c31cb1f?auto=format&w=500&q=80"
  },
  
];


let cart = [   {
  id: 1,
  name: "Classic White T-Shirt",
  quantity:2,
  price: 199.9,
  imageLink: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSOqsARSg_LcoknC-do7jr1wbI9qDuE4vhb_0g7Yl4mPdkdxQsyTSe9asnyFEClGM-vJQ7pi1IVIEzJesHq1s3GN0kRq4yyp3QFQhUQp7y3k4HRKZ0sVQf0"
},
{
  id: 2,
  name: "Denim Jeans",
  price: 499.9,  quantity:10,
  imageLink: "https://images.unsplash.com/photo-1592595293637-8557fa6d3c64?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=500"
},];


// GET /api/products: list 5-10 mock items
app.get("/api/products", (req, res) => {
  res.json(products);
});

app.get("/api/cart", (req, res) => {
  res.json({
    cart: cart,

  });
});

// DELETE /api/cart/:id: Remove item from cart by id
app.delete("/api/cart/:id", (req, res) => {

  const itemId = Number(req.params.id);
  const index = cart.findIndex(item => item.id === itemId);

  if (index === -1) {
    return res.status(404).json({ message: "Item not found in cart." });
  }

  // Remove the item from the cart
  cart.splice(index, 1);
  
  const total = cart.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);

  res.json({
    message: "Item removed from cart.",
    cart: cart,
    total:total
  });
});

app.post("/api/cart", (req, res) => {
  // console.log(req.body)
  const { productId, qty } = req.body;

  if (!productId || !qty || qty < 1) {
    return res.status(400).json({ message: "productId and qty are required, qty must be > 0." });
  }

  // Find the product in products list
  const product = products.find(p => p.id === Number(productId));
  // console.log(product)
  if (!product) {
    return res.status(404).json({ message: "Product not found." });
  }

  // check if item is already in cart
  const cartItem = cart.find(item => item.id === Number(productId));
  if (cartItem) {
  
    // console.log(cartItem)
    cartItem.quantity += qty;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: qty,
      imageLink: product.imageLink
    });
  }

  const total = cart.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
// console.log(cart)
  res.json({
    message: "Item added to cart.",
    cart: cart,
    total: total
  });
});


app.post("/api/checkout", (req, res) => {
  const { cartItems } = req.body;

  if (cartItems.length === 0) {
    return res.status(400).json({ message: "add something to cart first" });
  }

  // Calculate total
  const total = cartItems.reduce(
    (acc, item) => acc + (item.price * (item.quantity || 1)),
    0
  );

  const receipt = {
    total,
    timestamp: new Date().toISOString()
  };

  res.json({
    message: "Checkout successful.",
    receipt
  });
});



module.exports = app;
