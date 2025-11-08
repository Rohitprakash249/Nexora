export default function PaymentSuccessModal({
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
