import { useEffect, useState } from "react";

export default function Stock() {
  const [stocks, setStocks] = useState([]);
  const [produits, setProduits] = useState([]);
  const [selectedProduit, setSelectedProduit] = useState("");
  const [quantite, setQuantite] = useState("");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const res = await fetch("/api/stock", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        setStocks(data);
        setLoading(false);
      } catch (err) {
        console.error("Erreur récupération stock:", err);
      }
    };
    fetchStocks();
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
        setProduits(data);
      } catch (err) {
        console.error("Erreur récupération produits:", err);
      }
    };
    fetchProduits();
  }, [token]);

  const ajouterStock = async () => {
    if (!selectedProduit || !quantite) return alert("Veuillez remplir tous les champs");

    try {
      const res = await fetch("http://localhost:8000/api/stock", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          produit_id: selectedProduit,
          commande_id: 1, 
          quantite: parseInt(quantite),
        }),
      });

      if (!res.ok) throw new Error("Erreur lors de l'ajout en stock");

      const data = await res.json();
      setStocks(prev => [...prev, data.entree_stock]);
      setSelectedProduit("");
      setQuantite("");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'ajout en stock");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Gestion du Stock</h2>

      <div className="mb-6 p-4 bg-white shadow rounded">
        <h3 className="font-semibold mb-2">Ajouter une entrée en stock</h3>
        <div className="flex gap-2 items-center">
          <select value={selectedProduit} onChange={(e) => setSelectedProduit(e.target.value)} className="border p-2 rounded">
            <option value="">Sélectionner un produit</option>
            {produits.map(p => (
              <option key={p.id} value={p.id}>{p.nom}</option>
            ))}
          </select>
          <input type="number" placeholder="Quantité" value={quantite} onChange={(e) => setQuantite(e.target.value)} className="border p-2 rounded w-24"/>
          <button onClick={ajouterStock} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Ajouter
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded p-4">
        <h3 className="font-semibold mb-2">Stock actuel</h3>
        {loading ? (
          <p>Chargement...</p>
        ) : (
          <table className="w-full text-left border">
            <thead>
              <tr>
                <th className="border px-2 py-1">Produit</th>
                <th className="border px-2 py-1">Quantité</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map(s => (
                <tr key={s.id}>
                  <td className="border px-2 py-1">{s.produit.nom}</td>
                  <td className="border px-2 py-1">{s.quantite}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
