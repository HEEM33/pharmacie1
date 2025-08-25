import React, { useEffect, useState } from "react";

export default function Commande() {
  const [commandes, setCommandes] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduit, setSelectedProduit] = useState("");
  const [selectedFournisseur, setSelectedFournisseur] = useState("");
  const token = localStorage.getItem("token");

  // Charger les commandes, fournisseurs et produits
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
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <select value={selectedFournisseur} onChange={(e) => setSelectedFournisseur(e.target.value)} className="border p-2 rounded" required>
          <option value="">Sélectionner un fournisseur</option>
          {fournisseurs.map((f) => (
            <option key={f.id} value={f.id}>
              {f.nom}
            </option>
          ))}
        </select>

        <select value={selectedProduit} onChange={(e) => setSelectedProduit(e.target.value)} className="border p-2 rounded" required>
          <option value="">Sélectionner un produit</option>
          {produits.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nom}
            </option>
          ))}
        </select>

        <button type="submit" className="flex-1 px-6 py-2 bg-blue-400 text-white rounded " disabled={loading}>
          {loading ? "Ajout..." : "Ajouter"}
        </button>
      </form>

      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Fournisseurs</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {commandes.map((commande) => (
            <tr key={commande.id}>
              <td>{commande.id}</td>
              <td>{commande.fournisseur?.nom}</td>
              <td>{commande.status}</td>
              <td>{}</td>
              <td>
                <button onClick={() => deleteCommande(commande.id)}>
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
