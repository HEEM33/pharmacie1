<<<<<<< HEAD
import React, { useEffect, useState } from "react";

=======
import React from "react";
import { MdDeleteSweep } from "react-icons/md";

const ActionTypes = {
  CART_ADD: "CART_ADD",
  CART_MINUS: "CART_MINUS",
  CART_REMOVE: "CART_REMOVE"
};

>>>>>>> f02c5a19c41f05ef6a0446e5363e502ee601d300

export default function Paiement() {
  const [vente, setVente] = useState([]);
  const token = localStorage.getItem("token");

<<<<<<< HEAD

  useEffect(() => {
     const fetchVentes = async () => {
    try {
      const res = await fetch("/api/vente", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      const data = await res.json();
      setVente(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des ventes :", error);
    }
  };
    fetchVentes();
  }, [token]);

  const format = (amount) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
  }).format(amount);
};

=======
>>>>>>> f02c5a19c41f05ef6a0446e5363e502ee601d300
  return (
    <>
    <div className="bg-white shadow-md p-4 rounded-lg mb-4">
          {vente.length === 0 ? (
            <p className="text-gray-500">🛒 Votre panier</p>
          ) : (
            vente.map(item => (
              <div key={item.id} className="flex flex-col md:flex-row gap-4 mb-3">
                <img src={`http://localhost:8000/uploads/products/${item.image}`} alt={item.nom} className="w-24 h-24 object-cover rounded-md" />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-semibold">{item.nom}</h4>
                    
                  </div>
                  <p>{format(item.prix_unitaire)}</p>
                  <div className="flex justify-between items-center mt-2">
                    
                    <span className="font-bold text-gray-800">
                      Total: {format(item.prix_unitaire * item.qty)}
                    </span>
                   
                  </div>
                </div>
              </div>
            ))
          )}
           <button className="mb-4 px-6 py-2.5  bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg transition duration-150 ">Payer</button>
        </div>
<<<<<<< HEAD
        </>
    )
} 
=======
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
>>>>>>> f02c5a19c41f05ef6a0446e5363e502ee601d300
