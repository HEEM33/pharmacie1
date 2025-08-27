import React, { useEffect, useState } from "react";

export default function Paiement() {
  const [ventes, setVentes] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchVentes = async () => {
      try {
        const res = await fetch("/api/ventes-en-attente", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        const data = await res.json();
        setVentes(data);
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

  const paye = async (vente) => {
    try {
      const res = await fetch("http://localhost:8000/api/paiement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          user_id: vente.user_id,
          vente_id: vente.id,
          methode_de_paiement: "espèce", 
          montant_total: vente.total
        })
      });

      if (!res.ok) throw new Error("Erreur lors du paiement");

      const data = await res.json();
      console.log("Paiement effectué :", data);

      setVentes(prev => prev.filter(v => v.id !== vente.id));

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-white shadow-md p-4 rounded-lg mb-4">
      {ventes.length === 0 ? (
        <p className="text-gray-500">🛒 Aucune vente en attente</p>
      ) : (
        ventes.map(vente => (
          <div key={vente.id} className="mb-6">
           
            {vente.produits.map(produit => (
              <div key={produit.id} className="flex flex-col md:flex-row gap-4 mb-3">
                <img
                  src={`http://localhost:8000/uploads/products/${produit.image}`}
                  alt={produit.nom}
                  className="w-24 h-24 object-cover rounded-md"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-semibold">{produit.nom}</h4>
                  </div>
                  <p>{format(produit.prix_unitaire)}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-bold text-gray-800">
                      Quantité: {produit.pivot.quantite}
                    </span>
                    <span className="font-bold text-gray-800">
                      Total: {format(produit.prix_unitaire * produit.pivot.quantite)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))
      )}
      <button onClick={paye} className="mb-4 px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg transition duration-150">
        Payer
      </button>
    </div>
  );
}
