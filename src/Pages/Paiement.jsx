import React from "react";
import { MdDeleteSweep } from "react-icons/md";

const ActionTypes = {
  CART_ADD: "CART_ADD",
  CART_MINUS: "CART_MINUS",
  CART_REMOVE: "CART_REMOVE"
};


export default function Paiement() {

  return (
    <>
    <div className="bg-white shadow-md p-4 rounded-lg mb-4" >
  <div className="flex flex-col md:flex-row gap-4">
    <img
     
      className="w-24 h-24 object-cover rounded-md"
    />
    <div className="flex-1">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold"></h4>
        <div className="flex items-center gap-2">
          <button  className="px-2 py-1 bg-gray-200 rounded">−</button>
          <span></span>
          <button  className="px-2 py-1 bg-gray-200 rounded">+</button>
        </div>
      </div>
      <div className="text-sm text-gray-600 mt-1">
        <p>Nom: </p>
       
        <p>Prix: </p>
      </div>
      <div className="flex justify-between items-center mt-2">
        <div className="flex gap-2">
          <a className="text-red-600 text-sm hover:underline">
             <MdDeleteSweep />
          </a>
          <button  className="text-blue-600 text-sm hover:underline">
            <i className="fa fa-heart mr-1"></i> Move to Wishlist
          </button>
        </div>
        <span className="font-bold text-gray-800"></span>
      </div>
    </div>
  </div>
</div>

<div className="bg-white shadow-md p-4 rounded-lg">
  <h4 className="text-lg font-semibold mb-2">Total</h4>
  <div className="flex justify-between mb-1 text-sm">
    <span>Subtotal</span>
    <span></span>
  </div>
  <div className="flex justify-between mb-1 text-sm">
    <span>Shipping</span>
    <span>Free</span>
  </div>
  <hr className="my-2" />
  <div className="flex justify-between font-semibold text-base">
    <span>Total (incl. VAT)</span>
    <span></span>
  </div>
  <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
    Payer  </button>
</div>
</>
  );
}
