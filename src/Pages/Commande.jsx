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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filtered = commandes.filter(c =>
    c.created_at.toLowerCase().includes(q.toLowerCase())
  );
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

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

        setCommandes((await resCommandes.json()).sort((a, b) => b.id - a.id));
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
      setCommandes([...commandes, data].sort((a, b) => b.id - a.id));
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
      <h1 className="text-2xl font-bold mb-4 uppercase"> Nouvelle des Commandes</h1>
      <form onSubmit={handleSubmit}  className="flex flex-wrap gap-4 items-center mb-6">
        <select value={selectedFournisseur} onChange={(e) => setSelectedFournisseur(e.target.value)} className="border p-2 rounded" required>
          <option value="" disabled>Sélectionner un fournisseur</option>
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

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="px-6 py-4">ID</th>
            <th className="px-6 py-4">Fournisseurs</th>
            <th className="px-6 py-4">Produits</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Date de commande</th>
            <th className="px-6 py-4">Date de reception</th>
            <th className="px-6 py-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((commande) => (
            <tr key={commande.id}>
              <td className="px-6 py-4">{commande.id}</td>
              <td className="px-6 py-4">{commande.fournisseur?.nom}</td>
              <td className="px-6 py-4">
                {commande.produits?.map((p, i) => (
                  <span key={i}>
                    {p.nom} ({p.pivot?.quantite})
                    {i < commande.produits.length - 1 && ", "}
                    {(i + 1) % 2 === 0 && <br />}
                  </span>
                ))}
              </td>
              <td className="px-6 py-4">{commande.status}</td>
              <td className="px-6 py-4"> {new Date(commande.created_at).toLocaleDateString("fr-FR", {
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
    </div>
    {/* pagination */}
              <div className="flex justify-center items-center gap-2 mt-4">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}
                  className="px-4 py-2 text-sm border rounded-lg bg-white hover:bg-gray-100 disabled:opacity-50">
                  Précédent
                </button>

                <span>
                  Page {currentPage} / {totalPages}
                </span>

                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm border rounded-lg bg-white hover:bg-gray-100 disabled:opacity-50">
                  Suivant
                </button>
              </div>
    </>
  );
  
}
