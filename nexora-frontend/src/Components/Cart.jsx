import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import SingleCartItem from "./SingleCartItem";
import PaymentSuccessModal from "./PaymentSuccessModal";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [displayPaymentModal, setDisplayPaymentModal] = useState(false);
  const [checkoutTotal, setCheckoutTotal] = useState("");
  const [receiptTimeStamp, setReceiptTimeStamp] = useState("bla");
  const [displayCheckoutForm, setDisplayCheckoutForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailValidOrInvalid, setEmailValidOrInvalid] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);
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
    } catch (err) {}
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
        setPlacingOrder(true);
      } else {
        setPlacingOrder(false);
        return;
      }
      if (cartItems.length === 0) {
        return;
      }
      try {
        setPlacingOrder(true);
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
          setDisplayCheckoutForm(false);
          setCartItems([]);
        } else {
          toast.error("checkout failed. Try again.");
          setPlacingOrder(false);
        }
      } catch (err) {
        alert("Network/Server Error");
        setPlacingOrder(false);
      } finally {
        setPlacingOrder(false);
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
              Checkout
            </button>
          </div>
        )}
      </div>
      {/* checkout Form */}
      {displayCheckoutForm === true && (
        <div className="flex justify-center  ">
          <div className="max-w-3xl mx-5 md:mx-10 mt-8  mb-20 w-full md:w-[90%] my-12  bg-white shadow rounded-lg p-8">
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
            {placingOrder === true ? (
              <button
                onClick={placeOrder}
                className="w-full mt-4 btn btn-primary"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="lucide animate-spin lucide-loader-pinwheel-icon lucide-loader-pinwheel"
                >
                  <path d="M22 12a1 1 0 0 1-10 0 1 1 0 0 0-10 0" />
                  <path d="M7 20.7a1 1 0 1 1 5-8.7 1 1 0 1 0 5-8.6" />
                  <path d="M7 3.3a1 1 0 1 1 5 8.6 1 1 0 1 0 5 8.6" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
              </button>
            ) : (
              <button
                onClick={placeOrder}
                className="w-full mt-4 btn btn-primary"
              >
                Place your order
              </button>
            )}
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
