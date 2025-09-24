import { Scanner } from "@yudiel/react-qr-scanner";
import { useEffect, useState } from "react";

export default function QRCodeScanner() {
  const [selectedProduit, setSelectedProduit] = useState(null);
  const [produits, setProduits] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastScanned, setLastScanned] = useState(null);
  const [quantite, setQuantite] = useState(1); 
  const [commandes, setCommandes] = useState([]);
  const [selectedCommandeId, setSelectedCommandeId] = useState(null);

  const token = localStorage.getItem("token");

  const [loadingProduits, setLoadingProduits] = useState(true);

  useEffect(() => {
    const fetchCommandes = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/commande", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        setCommandes(data);
      } catch (err) {
        console.error("Erreur récupération commandes:", err);
      }
    };
    fetchCommandes();
  }, [token]);


useEffect(() => {
  const fetchProduits = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/produit", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      const produitsConvertis = data.map((p) => ({ ...p, id: Number(p.id) }));
      setProduits(produitsConvertis);
    } catch (err) {
      console.error("Erreur récupération produits:", err);
    } finally {
      setLoadingProduits(false);
    }
  };
  fetchProduits();
}, [token]);


  const handleScan = (value) => {
    const text =
      value?.rawValue ?? (Array.isArray(value) ? value[0]?.rawValue : null);
    if (!text) return;
    if (loadingProduits) {
  setMessage("Les produits sont encore en cours de chargement...");
  return;
}

    if (lastScanned === text) return;
    setLastScanned(text);
    const produitId = Number(text);
    const produitTrouve = produits.find((p) => p.id === produitId);

    if (produitTrouve) {
      setSelectedProduit(produitTrouve);
      
      setQuantite(1); 
    } else {
      setMessage(` Aucun produit trouvé pour l’ID : ${produitId}`);
    }
  };

  const envoyerScan = async () => {
    if (!selectedProduit) return;

    setLoading(true);
    setMessage("");

    try {
     const res = await fetch("http://localhost:8000/api/onscan", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          produit_id: selectedProduit.id,
          quantite: quantite,
          commande_id: selectedCommandeId,
 
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(
          `${data.message} | Stock actuel: ${data.produit.niveau_en_stock}`
        );
      } else {
        setMessage(`Erreur: ${data.message}`);
      }
    } catch (err) {
      setMessage("Erreur réseau", err);
    }

    setLoading(false);
    setLastScanned(null);
    setSelectedProduit(null);
    setTimeout(() => {
        window.location.reload();
      }, 5000);  };

  return (
    
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h2 className="text-xl font-semibold mb-4">Scanner un produit</h2>

      {/* Scanner */}
      {loadingProduits && <p className="mt-4 text-gray-700">Chargement des produits...</p>}

      <div className="w-64 h-64 border-2 border-gray-300 rounded-lg overflow-hidden shadow-md">
        <Scanner
          onScan={handleScan}
          onError={(error) => console.error("Erreur scanner:", error)}
          components={{ finder: true }}
          paused={loadingProduits}
        />
      </div>

      {selectedProduit && (
        <div className="mt-4 p-4 bg-white shadow rounded w-full max-w-md relative">
          <button className="absolute top-2 right-2 text-gray-500 hover:text-red-700" onClick={() =>{ setSelectedProduit(null);  window.location.reload();}} >
                ✕
          </button>
          <p className="font-semibold">
             {selectedProduit.nom} ({selectedProduit.niveau_en_stock})
          </p>

          <label className="block mt-2">
            Quantité :
            <input type="number" min="1" value={quantite} onChange={(e) => setQuantite(Number(e.target.value))} className="ml-2 border rounded p-1 w-20"/>
          </label>
          <select value={selectedCommandeId ?? ""} onChange={(e) => setSelectedCommandeId(Number(e.target.value))} className="border p-2 rounded" required>
            <option value="">Sélectionner l'identifiant de la commande</option>
            {commandes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.id}
              </option>
            ))}
          </select>


          <button onClick={envoyerScan} disabled={loading} className="mt-3 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
            {loading ? "⏳ Envoi..." : " Valider"}
          </button>
        </div>
      )}

      {message && <p className="mt-4 text-gray-700">{message}</p>}
    </div>
  );
}
