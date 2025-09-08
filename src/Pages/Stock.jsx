import { useCallback, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FaCheck } from "react-icons/fa";
import { useOutletContext } from "react-router-dom";

export default function Stock() {
  const [stocks, setStocks] = useState([]);
  const [produits, setProduits] = useState([]);
  const [commandes, setCommandes] = useState([]);
  const [selectedProduit, setSelectedProduit] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [quantite, setQuantite] = useState("");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const [errors, setErrors] = useState({});
   const { q } = useOutletContext();

  const filtered = stocks.filter(s =>
  s.produit?.nom.toLowerCase().includes(q.toLowerCase())
);

  const fetchStocks = useCallback(async () => {
      try {
        const res = await fetch("http://localhost:8000/api/stock", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setStocks(data);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des Stocks :", error);
      }
    },[token]);
  
   useEffect(() => {
      if (token) {
        fetchStocks();
      }
    }, [token, fetchStocks]);

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
        console.error("Erreur récupération produits:", err);
      }
    };
    fetchCommandes();
  }, [token]);

  const ajouterStock = async () => {
    if (!selectedId ||!selectedProduit || !quantite) return alert("Veuillez remplir tous les champs");

    try {
      const res = await fetch("http://localhost:8000/api/stock", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          produit_id: parseInt(selectedProduit),
          commande_id: parseInt(selectedId), 
          quantite: parseInt(quantite),
        }),
      });

      if (!res.ok) {
       const errorData = await res.json();
    setErrors(errorData.errors || {});
    throw new Error(errorData.message || "Échec de connexion");
    }

      const data = await res.json();
      console.log("jjj", data)
      setStocks(prev => [...prev, data.entree_stock]);
      toast.success("Nouvel entree en stock");
      setSelectedId("");
      setSelectedProduit("");
      setQuantite("");
      fetchStocks();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'ajout en stock");
    }
  };
  

  return (
    <>
    <Toaster position="top-right" />
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Entrée en Stock</h2>

      <div className="mb-6 p-4 bg-white shadow rounded">
        <h3 className="font-semibold mb-2">Ajouter une entrée en stock</h3>
        <div className="flex gap-2 items-center">
          <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)} className="border p-2 rounded" required>
            <option value="">Sélectionner l'identifiant de la commande</option>
            {commandes.map(c => (
              <option key={c.id} value={c.id}>{c.id}</option>
            ))}
          </select>
          {errors.selectedId && <p className="text-red-500 text-sm">{errors.selectedId[0]}</p>}
          <select value={selectedProduit} onChange={(e) => setSelectedProduit(e.target.value)} className="border p-2 rounded" required>
            <option value="">Sélectionner un produit</option>
            {produits.map(p => (
              <option key={p.id} value={p.id}>{p.nom}</option>
            ))}
          </select>
          {errors.selectedProduit && <p className="text-red-500 text-sm">{errors.selectedProduitd[0]}</p>}
          <input type="number" min="1" placeholder="Quantité" value={quantite} onChange={(e) => setQuantite(e.target.value)} className="border p-2 rounded w-24" required />
          {errors.quantite && <p className="text-red-500 text-sm">{errors.quantite[0]}</p>}
          <button onClick={ajouterStock} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            <FaCheck />
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded p-4">
        <h3 className="font-semibold mb-2">Stock actuel</h3>
        {loading ? (
          <div role="status">
            <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        ) : (
          <table className="w-full text-left border">
            <thead>
              <tr>
                <th className="border px-2 py-1">Produit</th>
                <th className="border px-2 py-1">Quantité</th>
                <th className="border px-2 py-1">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td className="border px-2 py-1">{s.produit.nom}</td>
                  <td className="border px-2 py-1">{s.quantite}</td>
                  <td> {new Date(s.created_at).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}{" "}
                  {new Date(s.created_at).toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
    </>
  );
}
