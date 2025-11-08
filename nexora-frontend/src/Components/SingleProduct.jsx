export default function SingleProduct({ productDetails, addToCart }) {
  function addProductToCart() {
    addToCart(productDetails.id);
  }
  return (
    <div className="card bg-white w-96 shadow-sm">
      <img
        className="w-full h-96 object-cover"
        src={productDetails.imageLink}
        alt="Shoes"
      />

      <div className="card-body flex">
        <h2 className="card-title text-gray-800 ">{productDetails.name}</h2>

        <button onClick={addProductToCart} className="btn btn-primary">
          Add To Cart
        </button>
      </div>
    </div>
  );
}
