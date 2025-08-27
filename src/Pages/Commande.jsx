import React, { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { MdDeleteSweep } from "react-icons/md";
import { useOutletContext } from "react-router-dom";

export default function Commande() {
  const [commandes, setCommandes] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduit, setSelectedProduit] = useState("");
  const [selectedFournisseur, setSelectedFournisseur] = useState("");
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
          produit_id: selectedProduit,
        }),
      });

      const data = await res.json();
      setCommandes([...commandes, data]);
      setSelectedFournisseur("");
      setSelectedProduit("");
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
      setCommandes(commandes.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
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

        <select value={selectedProduit} onChange={(e) => setSelectedProduit(e.target.value)} className="border p-2 rounded gap-4" required>
          <option value="">Sélectionner un produit</option>
          {produits.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nom}
            </option>
          ))}
        </select>

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
            <th>Date</th>
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
  );
}
