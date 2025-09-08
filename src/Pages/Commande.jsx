import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FaCheck } from "react-icons/fa";
import { MdDeleteSweep } from "react-icons/md";
import { useOutletContext } from "react-router-dom";

export default function Commande() {
  const [commandes, setCommandes] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFournisseur, setSelectedFournisseur] = useState("");
  const [items, setItems] = useState([{ produit_id: "", quantite: 1 }]); 
  const [errors, setErrors] = useState({});
  const token = localStorage.getItem("token");
  const { q } = useOutletContext();

  const filtered = commandes.filter(c =>
    c.created_at.toLowerCase().includes(q.toLowerCase())
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resCommandes, resFournisseurs, resProduits] = await Promise.all([
          fetch("http://localhost:8000/api/commande", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:8000/api/fournisseur", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:8000/api/produit", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setCommandes(await resCommandes.json());
        setFournisseurs(await resFournisseurs.json());
        setProduits(await resProduits.json());
      } catch (err) {
        console.error("Erreur récupération :", err);
      }
    };

    fetchData();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/commande", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fournisseur_id: selectedFournisseur,
          items,
        }),
      });

      if (!res.ok) {
       const errorData = await res.json();
    setErrors(errorData.errors || {});
    throw new Error(errorData.message || "Échec de connexion");
    }
      const data = await res.json();
      setCommandes([...commandes, data]);
      toast.success("Nouvelle commande enregistre avec succes");
      setSelectedFournisseur("");
      setItems([{ produit_id: "", quantite: 1 }]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteCommande = async (id) => {
    try {
      await fetch(`http://localhost:8000/api/commande/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Commande supprime avec succes");
      setCommandes(commandes.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const addItem = () => {
    setItems([...items, { produit_id: "", quantite: 1 }]);
  };

  const handleProduitChange = (index, value) => {
    const newItems = [...items];
    newItems[index].produit_id = value;
    setItems(newItems);
  };

  const handleQuantiteChange = (index, value) => {
    const newItems = [...items];
    newItems[index].quantite = value;
    setItems(newItems);
  };

  return (
    <>
     <Toaster position="top-right" />
    <div className="p-4">
      <h2>📦 Nouvelle des Commandes</h2>
      <form onSubmit={handleSubmit}  className="flex flex-wrap gap-4 items-center mb-6">
        <select value={selectedFournisseur} onChange={(e) => setSelectedFournisseur(e.target.value)} className="border p-2 rounded" required>
          <option value="">Sélectionner un fournisseur</option>
          {fournisseurs.map((f) => (
            <option key={f.id} value={f.id}>
              {f.nom}
            </option>
          ))}
        </select>
        {errors.id && <p className="text-red-500">{errors.id[0]}</p>}
        <div className="flex flex-col gap-4 mb-6">
          {items.map((item, index) => (
            <div key={index} className="flex gap-2 items-center">
        <select  value={item.produit_id} onChange={(e) => handleProduitChange(index, e.target.value)} className="border p-2 rounded gap-4" required>
          <option value="">Sélectionner un produit</option>
          {produits.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nom}
            </option>
          ))}
        </select>
        {errors.produit_id && <p className="text-red-500">{errors.produit_id[0]}</p>}
         <input type="number" min="1" value={item.quantite}  onChange={(e) => handleQuantiteChange(index, e.target.value)} className="border p-2 rounded w-24" required/>
         {errors.quantite && <p className="text-red-500">{errors.quantite[0]}</p>}
        </div>
        ))}
        </div>
        <button type="button" onClick={addItem} className="px-4 py-2 bg-green-600 text-white rounded">
            ➕ Ajouter un produit
          </button>
        <button type="submit" className=" px-6 py-2 bg-blue-600 text-white rounded " disabled={loading}>
          {loading ? "Ajout..." : <FaCheck />}
        </button>
      </form>

      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Fournisseurs</th>
            <th>Status</th>
            <th>Date de commande</th>
            <th>Date de reception</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((commande) => (
            <tr key={commande.id}>
              <td>{commande.id}</td>
              <td>{commande.fournisseur?.nom}</td>
              <td>{commande.status}</td>
              <td> {new Date(commande.created_at).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}{" "}
                  {new Date(commande.created_at).toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}</td>
                  <td> {new Date(commande.updated_at).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}{" "}
                  {new Date(commande.updated_at).toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}</td>
              <td>
                <button onClick={() => deleteCommande(commande.id)}  className="font-medium text-red-600 dark:text-red-500 cursor-pointer">
                  <MdDeleteSweep />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
}
