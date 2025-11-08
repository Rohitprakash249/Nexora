import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import SingleProduct from "./SingleProduct";

export default function HomePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/products")
      .then((response) => response.json())
      .then((data) => {
        const productsData = data;

        setProducts(productsData);
      })
      .catch((error) => {
        toast.error("something went wrong! please visit later.");
      });
  }, []);

  async function addToCart(productId, quantity = 1) {
    try {
      const response = await fetch("http://localhost:8080/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: productId,
          qty: quantity,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add to cart");
      } else {
        toast.success("Product is added to cart Succesfully.");
      }

      return await response.json();
    } catch (error) {
      toast.error("Failed to add product to cart");
      console.error(error);
      return null;
    }
  }

  return (
    <div className="p-10 flex justify-center flex-wrap gap-10">
      {products.map((singleItem) => (
        <SingleProduct
          addToCart={addToCart}
          key={singleItem.id}
          productDetails={singleItem}
        />
      ))}
    </div>
  );
}
