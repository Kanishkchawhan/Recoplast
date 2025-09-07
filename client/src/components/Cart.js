import React, { useState, useEffect } from "react";

const Cart = ({ cart, onCheckout, onRemove }) => {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setTotal(cart.reduce((sum, item) => sum + (item.couponCost || 0), 0));
  }, [cart]);

  return (
    <div className="fixed right-4 bottom-4 bg-white shadow-2xl rounded-2xl p-6 w-80 z-50 border-2 border-green-200">
      <h2 className="text-xl font-bold mb-4 text-green-700">🛒 Cart</h2>
      {cart.length === 0 ? (
        <div className="text-gray-500">Your cart is empty.</div>
      ) : (
        <ul className="mb-4 space-y-2">
          {cart.map((item, idx) => (
            <li key={idx} className="flex justify-between items-center">
              <span>{item.name}</span>
              <span className="text-green-700 font-semibold">{item.couponCost} 🏷️</span>
              <button
                className="ml-2 text-red-600 hover:underline"
                onClick={() => onRemove(item._id)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="font-bold text-green-800 mb-4">Total: {total} Coupons</div>
      <button
        className="w-full bg-green-600 text-white py-2 rounded-xl font-semibold hover:bg-green-700 transition"
        disabled={cart.length === 0}
        onClick={onCheckout}
      >
        Checkout
      </button>
    </div>
  );
};

export default Cart;
