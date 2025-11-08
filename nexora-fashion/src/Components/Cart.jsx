import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [displayPaymentModal, setDisplayPaymentModal] = useState(false);
  const [checkoutTotal, setCheckoutTotal] = useState("");
  const [receiptTimeStamp, setReceiptTimeStamp] = useState("bla");
  const [displayCheckoutForm, setDisplayCheckoutForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailValidOrInvalid, setEmailValidOrInvalid] = useState("");
  const getTotal = () => {
    return cartItems
      .reduce((sum, item) => sum + item.price * item.quantity, 0)
      .toFixed(2);
  };

  async function deleteCartItem(id) {
    try {
      fetch(`http://localhost:8080/api/cart/${id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => setCartItems(data.cart));
    } catch (err) {
      // console.log("some error occured")
    }
  }

  function checkIfAllInfoIsProvided() {
    if (!name || !email) {
      toast.error("fill your name and email");
    }
    if (name && email) {
      if (emailValidOrInvalid === "valid") {
        return true;
      } else {
        return false;
      }
    }
  }

  function placeOrder() {
    async function handleCheckout() {
      let checkIfAllInfoSupplied = checkIfAllInfoIsProvided();
      if (checkIfAllInfoSupplied === true) {
      } else {
        return;
      }
      if (cartItems.length === 0) {
        return;
      }
      try {
        const response = await fetch("http://localhost:8080/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cartItems }),
        });
        const data = await response.json();

        if (response.ok) {
          setCheckoutTotal(data.receipt.total);
          setReceiptTimeStamp(data.receipt.timestamp);
          //    setTimeStamp(data)
          setDisplayPaymentModal(true);
        } else {
          toast.error("checkout failed. Try again.");
        }
      } catch (err) {
        alert("Network/Server Error");
      }
    }
    handleCheckout();

    // setDisplayPaymentModal(true)
  }
  useEffect(() => {
    fetch("http://localhost:8080/api/cart")
      .then((response) => response.json())
      .then((data) => {
        console.log(data.cart);
        setCartItems(data.cart);
      })
      .catch((error) => {
        console.error("Error fetching cart data:", error);
      });
  }, []);

  function toggleCheckoutForm() {
    if (displayCheckoutForm === true) {
      setDisplayCheckoutForm(false);
    } else {
      setDisplayCheckoutForm(true);

      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }
  }
  useEffect(() => {
    setEmailStatus();
    console.log("its working");
  }, [email]);
  function validateEmail(emailId) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
  function setEmailStatus() {
    if (validateEmail(email)) {
      setEmailValidOrInvalid("valid");
    } else {
      setEmailValidOrInvalid("invalid");
    }
  }
  return (
    <>
      {" "}
      <div className="max-w-3xl mx-auto mt-8 px-4 mb-10">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        {cartItems.length === 0 ? (
          <div className="p-6 bg-white shadow rounded-lg text-center">
            <p className="text-gray-600">Your cart is empty.</p>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg p-6">
            <ul className="divide-y">
              {cartItems.map((item) => (
                <SingleCartItem
                  productDetails={item}
                  deleteCartItem={deleteCartItem}
                />
              ))}
            </ul>
            <div className="flex justify-between items-center mt-6 border-t pt-4">
              <span className="text-xl font-semibold text-gray-700">
                Total:
              </span>
              <span className="text-2xl font-bold text-gray-700">
                ₹{getTotal()}
              </span>
            </div>
            <button
              onClick={toggleCheckoutForm}
              className="btn btn-primary w-full mt-6"
            >
              Place Order
            </button>
          </div>
        )}
      </div>
      {/* checkout Form */}
      {displayCheckoutForm === true && (
        <div className="flex justify-center   ">
          <div className="max-w-3xl mx-10 mt-8  mb-10 w-full md:w-[90%] my-12  bg-white shadow rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
              Checkout
            </h2>

            <div>
              <label
                htmlFor="checkout-name"
                className="block text-gray-700 font-medium mb-2"
              >
                Name
              </label>
              <input
                onChange={(e) => setName(e.target.value)}
                id="checkout-name"
                name="checkout-name"
                type="text"
                className="w-full px-4 py-2 text-black border border-gray-300 rounded-md focus:ring focus:ring-blue-200 outline-none"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label
                htmlFor="checkout-email"
                className="block  text-gray-700 font-medium mb-2"
              >
                Email
              </label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                id="checkout-email"
                name="checkout-email"
                type="email"
                className={`w-full text-black px-4 py-2 border border-gray-500 rounded-md focus:ring focus:ring-blue-200 outline-none ${
                  emailValidOrInvalid === "valid" && `border-green-500`
                } ${emailValidOrInvalid === "invalid" && `border-red-500`} ${
                  emailValidOrInvalid === "" && ``
                } `}
                placeholder="Enter your email"
              />
            </div>
            <button
              onClick={placeOrder}
              className="w-full mt-4 btn btn-primary"
            >
              Place your order
            </button>
          </div>
        </div>
      )}
      {displayPaymentModal === true && (
        <PaymentSuccessModal
          receiptTimeStamp={receiptTimeStamp}
          checkoutTotal={checkoutTotal}
          setDisplayPaymentModal={setDisplayPaymentModal}
        />
      )}
    </>
  );
}

export default Cart;

function PaymentSuccessModal({
  setDisplayPaymentModal,
  checkoutTotal,
  receiptTimeStamp,
}) {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 duration-1000 flex items-center justify-center z-50 pointer-events-none select-none">
      <div className="bg-white rounded-lg shadow-lg px-8 py-6 max-w-sm w-full flex flex-col items-center">
        {/* Success icon: a circle with a checkmark */}
        <div className="flex items-center justify-center mb-4">
          <svg
            width="60"
            height="60"
            viewBox="0 0 24 24"
            className="text-green-500"
          >
            <circle cx="12" cy="12" r="10" fill="#4ade80" />
            <path
              d="M8 12.5l3 3 5-5"
              stroke="#fff"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-green-600 mb-2">
          Payment Successful!
        </h2>
        <p className="text-gray-600 mb-2 text-center">
          Thank you for your purchase.
        </p>
        <div className="my-4 w-full flex flex-col gap-1">
          <div className="flex justify-between text-gray-700">
            <span className="font-medium">Total:</span>
            <span className="font-semibold">₹{checkoutTotal}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span className="font-medium">Time:</span>
            <span>
              {receiptTimeStamp}
              {/* {new Date().toLocaleString()} */}
            </span>
          </div>
        </div>
        <button
          className="mt-4 btn btn-primary pointer-events-auto"
          onClick={() => setDisplayPaymentModal(false)}
        >
          Close
        </button>
      </div>
    </div>
  );
}

function SingleCartItem({ productDetails, deleteCartItem }) {
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
