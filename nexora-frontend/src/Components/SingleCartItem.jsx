export default function SingleCartItem({ productDetails, deleteCartItem }) {
  function removeItem() {
    deleteCartItem(productDetails.id);
  }

  return (
    <li
      key={productDetails.id}
      className="flex items-center justify-between py-4"
    >
      <div className="flex items-center gap-4">
        <img
          src={productDetails.imageLink}
          alt={productDetails.name}
          className="w-25 h-30 object-cover rounded"
        />
        <div>
          <div className="font-semibold text-gray-800">
            {productDetails.name}
          </div>
          <div className="text-gray-500">Qty: {productDetails.quantity}</div>
          <button
            onClick={removeItem}
            className="text-red-500 font-semibold cursor-pointer hover:border-b-2 duration-300 "
          >
            Delete
          </button>
        </div>
      </div>
      <div className="text-lg font-semibold text-gray-700">
        ₹{(productDetails.price * productDetails.quantity).toFixed(2)}
      </div>
    </li>
  );
}
