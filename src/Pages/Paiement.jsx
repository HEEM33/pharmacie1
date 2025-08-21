import React, { useEffect, useState } from "react";


export default function Paiement() {
  const [vente, setVente] = useState([]);
  const token = localStorage.getItem("token");


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
        </>
    )
} 