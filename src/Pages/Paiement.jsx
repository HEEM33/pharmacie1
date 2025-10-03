import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FaCheck, FaPrint } from "react-icons/fa";
import echoPromise from "../echo";

export default function Paiement() {
  const [ventes, setVentes] = useState([]);
  const [facture, setFacture] = useState(null);
  const token = localStorage.getItem("token");
  const [methodes, setMethodes] = useState({});
  const [montantRecu, setMontantRecu] = useState({});
  const [showCaisse, setShowCaisse] = useState({});
  const [showMobile, setShowMobile] = useState({});
  const [echo, setEcho] = useState(null);

  const fetchVentes = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/ventes-en-attente", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Erreur lors de la récupération des ventes");
      const data = await res.json();
      setVentes(data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const initEcho = async () => {
      console.log('Initializing Echo...');
      try {
        const echoInstance = await echoPromise;
        console.log('Echo instance received:', echoInstance);
        setEcho(echoInstance);
      } catch (error) {
        console.error("Failed to initialize Echo:", error);
      }
    };
    initEcho();
  }, []);

  useEffect(() => {
    fetchVentes();
  }, [token]);

  useEffect(() => {
    if (echo) {
      console.log("Echo: Instance ready, checking channel subscription");
      try {
        console.log("Echo: Joining private channel 'ventes' and listening for 'VenteCreated'");
        echo.private("ventes").listen("VenteCreated", (e) => {
          console.log("⚡ VenteCreated reçu:", e);
          const newVente = {
            id: e.id,
            total: e.total,
            status: e.status,
            user_id: token ? JSON.parse(atob(token.split('.')[1])).sub : null, // Extract user_id from token if needed
            produits: e.produits
          };
          setVentes((prev) => [...prev, newVente]);
          toast.success(`Nouvelle vente #${e.id}`);
        });
      } catch (error) {
        console.error("Echo: Failed to subscribe to channel 'ventes'", error);
      }

      return () => {
        console.log("Echo: Leaving channel 'ventes'");
        if (echo.leaveChannel) {
          echo.leaveChannel("ventes");
        }
      };
    }
  }, [echo]);

  const format = (amount) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
    }).format(amount);
  };

  const paye = async (vente) => {
    try {
      const methode = methodes[vente.id] || "espèce";
      const montant = parseFloat(montantRecu[vente.id] || vente.total);
      if (montant < vente.total) {
        toast.error("Montant insuffisant");
        return;
      }
      const monnaie = montant - vente.total;
      const res = await fetch("http://localhost:8000/api/paiement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          user_id: vente.user_id,
          vente_id: vente.id,
          methode_de_paiement: methode,
          montant_total: vente.total
        })
      });

      if (!res.ok) throw new Error("Erreur lors du paiement");

      toast.success("Paiement effectué");
      setVentes(prev => prev.filter(v => v.id !== vente.id));
      setFacture({ ...vente, date: new Date(),montantRecu: montant,
      monnaie: monnaie,   methode: methode,
      caissierId: vente.user_id });

    } catch (error) {
      toast.error(error.message);
    }
  };

const payeMobile = async (vente) => {
  try {
    const res = await fetch("http://localhost:8000/api/init-mobile-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        vente_id: vente.id,
        amount: vente.total,
      })
    });

    const data = await res.json();

    if (data.code === "201") {
      window.location.href = data.data.payment_url;
    } else {
      toast.error("Erreur CinetPay");
    }
  } catch (err) {
    console.error(err);
    toast.error("Impossible d'initialiser le paiement");
  }
};

const calculeTotal = (produits) => {
  return produits.reduce((acc, p) => acc + p.prix_unitaire * p.pivot.quantite, 0);
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
        <p class="text-center">Adresse: Rue Flaubert</p>
        <p class="text-center">Téléphone: 1234567890</p>
        <p>Date: ${facture.date.toLocaleDateString()} ${facture.date.toLocaleTimeString()}</p>
        <p>N° Caissier : ${facture.caissierId}</p>
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
            <tr>
              <td>Méthode de paiement</td>
              <td class="text-right">${facture.methode}</td>
            </tr>
            <tr>
              <td>Montant reçu</td>
              <td class="text-right">${format(facture.montantRecu)}</td>
            </tr>
            <tr>
              <td>Monnaie rendue</td>
              <td class="text-right">${format(facture.monnaie)}</td>
            </tr>
          </tbody>
        </table>
        <div class="text-center">
          <p>Merci pour votre achat !</p>
        </div>
      </body>
    </html>
  `;

  printWindow.document.write(content);
  printWindow.document.close();
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
           <h3 className="font-bold mb-2">Vente #{vente.id}</h3>
           <div className="flex items-start gap-6">
            <div className="flex flex-col gap-4">
            {vente.produits.map(produit => (
              <div key={produit.id} className="flex flex-col md:flex-row gap-4 mb-3">
                <img src={`http://localhost:8000/uploads/products/${produit.image}`} alt={produit.nom} className="w-24 h-24 object-cover rounded-md"/>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-semibold">{produit.nom}</h4>
                  </div>
                  <p>{format(produit.prix_unitaire)}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-bold text-gray-800">
                      Quantité: {produit.pivot.quantite}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            </div>
             <div className="flex flex-col gap-2 ml-auto">
            <span className="font-bold text-gray-800">
                  Total: {format(calculeTotal(vente.produits))}
             </span>
             <div className="flex items-center gap-2 mt-2">
                <select value={methodes[vente.id] } onChange={(e) => {
                  const value = e.target.value;
                  setMethodes({ ...methodes, [vente.id]: value });
                  setShowCaisse({ ...showCaisse, [vente.id]: value === "espèce" });
                  setShowMobile({ ...showMobile, [vente.id]: value === "mobile" });
                   }} className="border px-3 py-2 rounded" >
                  <option value="" disabled selected>Methode</option>
                  <option value="espèce">Espèce</option>
                  <option value="mobile">Mobile</option>
                </select>
              </div>
              </div>

        </div>

            {showCaisse[vente.id] && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded shadow-lg">
      <h2 className="text-lg font-bold mb-4">Paiement en espèce</h2>
      <input type="number" placeholder="Montant reçu" value={montantRecu[vente.id] || ""}
        onChange={(e) =>
          setMontantRecu({ ...montantRecu, [vente.id]: e.target.value })
        }
        className="border px-3 py-2 rounded w-32" required/>
      <p className="mt-2">
        Monnaie:{" "}
        {montantRecu[vente.id]
          ? format(montantRecu[vente.id] - vente.total)
          : format(0)}
      </p>
      <div className="mt-4 flex gap-2">
        <button onClick={() => paye(vente)} className="px-4 py-2 bg-green-600 text-white rounded">
          Valider
        </button>
        <button onClick={() => setShowCaisse({ ...showCaisse, [vente.id]: false })} className="px-4 py-2 bg-gray-400 text-white rounded">
          Annuler
        </button>
      </div>
    </div>
  </div>
)}

    {showMobile[vente.id] && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded shadow-lg">
      <h2 className="text-lg font-bold mb-4">Paiement Mobile</h2>
      <p>Total à payer : {format(vente.total)}</p>
      <button onClick={() => payeMobile(vente)} className="px-4 py-2 bg-blue-600 text-white rounded">
  Payer
</button>
      <button onClick={() => setShowMobile({ ...showMobile, [vente.id]: false })} className="ml-2 px-4 py-2 bg-gray-400 text-white rounded">
        Annuler
      </button>
    </div>
  </div>
)}
          </div>
        ))
      )}

    </div>

    {facture && (
  <div className="my-6">
    <button onClick={handlePrint}><FaPrint /></button>
    <div className="border border-gray-400 p-4 max-w-md mx-auto text-sm">
      <div className="text-center mb-4">
        <p className="font-bold">Ma Pharmacie</p>
        <p>Adresse de la pharmacie</p>
        <p>Téléphone: 1234567890</p>
        <p className="text-gray-600 text-sm">
          Date: {facture.date.toLocaleDateString()} {facture.date.toLocaleTimeString()}
        </p>
        <p className="text-gray-600 text-sm">
         N° Caissier : {facture.caissierId}
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
          <tr>
            <td className="py-1">Méthode de paiement</td>
            <td className="text-right py-1">{facture.methode}</td>
          </tr>
          <tr>
            <td className="py-1">Montant reçu</td>
            <td className="text-right py-1">{format(facture.montantRecu)}</td>
          </tr>
          <tr>
            <td className="py-1">Monnaie rendue</td>
            <td className="text-right py-1">{format(facture.monnaie)}</td>
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
