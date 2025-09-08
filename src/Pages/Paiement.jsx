import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FaPrint } from "react-icons/fa";

export default function Paiement() {
  const [ventes, setVentes] = useState([]);
  const [facture, setFacture] = useState(null);
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
      toast.success("Paiement reussi");
      setVentes(prev => prev.filter(v => v.id !== vente.id));
      setFacture({ ...vente, date: new Date() }); 

    } catch (error) {
      console.error(error);
    }
  };
  const handlePrint = () => {
  if (!facture) return;

  const printWindow = window.open('', '_blank', 'width=800,height=600');
  if (!printWindow) return;

  const content = `
    <html>
      <head>
        <title>Facture</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          td, th { border-bottom: 1px solid #ddd; padding: 8px; }
          .text-right { text-align: right; }
          .text-center { text-align: center; margin-top: 20px; }
        </style>
      </head>
      <body>
        <h2 class="text-center">Ma Pharmacie</h2>
        <p class="text-center">Adresse de la pharmacie</p>
        <p class="text-center">Téléphone: 1234567890</p>
        <p>Date: ${facture.date.toLocaleDateString()} ${facture.date.toLocaleTimeString()}</p>
        <table>
          <tbody>
            ${facture.produits.map(p => `
              <tr>
                <td>${p.nom} (${p.pivot.quantite} x ${format(p.prix_unitaire)})</td>
                <td class="text-right">${format(p.prix_unitaire * p.pivot.quantite)}</td>
              </tr>
            `).join('')}
            <tr class="font-bold">
              <td>Total</td>
              <td class="text-right">${format(facture.total)}</td>
            </tr>
          </tbody>
        </table>
        <div class="text-center">
          <p>Merci pour votre achat !</p>
        </div>
      </body>
    </html>
  `;
  printWindow.document.body.innerHTML = content;
  printWindow.print();
};



  return (
    <>
    <Toaster position="top-right" />
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
                <button onClick={() => paye(vente)} className="mb-4 px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg transition duration-150">
                  Payer
                </button>
              </div>

            ))}
          </div>
        ))
      )}
      
    </div>

    {facture && (
        <div className="my-6">
          <button onClick={handlePrint} ><FaPrint /></button>
          <div className="border border-gray-400 p-4 max-w-md mx-auto text-sm">
            <div className="text-center mb-4">
              <p className="font-bold">Ma Pharmacie</p>
              <p>Adresse de la pharmacie</p>
              <p>Téléphone: 1234567890</p>
              <p className="text-gray-600 text-sm">
                Date: {facture.date.toLocaleDateString()} {facture.date.toLocaleTimeString()}
              </p>
            </div>
            <table className="w-full mb-4 text-left">
              <tbody>
                {facture.produits.map(p => (
                  <tr key={p.id} className="border-b border-gray-200">
                    <td className="py-1">{p.nom} ({p.pivot.quantite} x {format(p.prix_unitaire)})</td>
                    <td className="text-right py-1">{format(p.prix_unitaire * p.pivot.quantite)}</td>
                  </tr>
                ))}
                <tr className="font-bold">
                  <td className="py-1">TOTAL</td>
                  <td className="text-right py-1">{format(facture.total)}</td>
                </tr>
              </tbody>
            </table>
            <div className="text-center mt-4">
              <p>Merci pour votre achat !</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
