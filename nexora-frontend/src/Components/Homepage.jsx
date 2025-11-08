import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import SingleProduct from "./SingleProduct";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    try {
      setLoading(true);
      fetch("http://localhost:8080/api/products")
        .then((response) => response.json())
        .then((data) => {
          const productsData = data;

          setProducts(productsData);
        })
        .catch((error) => {
          toast.error("something went wrong! please visit later.");
        });
      setLoading(false);
    } catch (err) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
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
    <div className="p-10 flex mb-10 justify-center flex-wrap gap-10">
      {loading === true && (
        <div className="flex flex-wrap gap-10">
          <ItemSkeleton />
          <ItemSkeleton />
          <ItemSkeleton />
          <ItemSkeleton />
          <ItemSkeleton />
          <ItemSkeleton />
          <ItemSkeleton />
          <ItemSkeleton />
        </div>
      )}
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

function ItemSkeleton() {
  return (
    <div className="card bg-white w-96 shadow-sm">
      <div
        className="w-full animate-pulse shimmer bg-gray-600 h-96 object-cover"
        // src={imageLink}
        alt="Shoes"
      ></div>

      <div className="card-body flex">
        <h2 className="card-title text-gray-800 animate-pulse">loading</h2>

        <button className="btn btn-primary animate-pulse ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide  animate-spin lucide-loader-pinwheel-icon lucide-loader-pinwheel"
          >
            <path d="M22 12a1 1 0 0 1-10 0 1 1 0 0 0-10 0" />
            <path d="M7 20.7a1 1 0 1 1 5-8.7 1 1 0 1 0 5-8.6" />
            <path d="M7 3.3a1 1 0 1 1 5 8.6 1 1 0 1 0 5 8.6" />
            <circle cx="12" cy="12" r="10" />
          </svg>
        </button>
      </div>
    </div>
  );
}
