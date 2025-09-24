import { useCallback, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { MdDeleteSweep, MdEdit } from "react-icons/md";
import { useOutletContext } from "react-router-dom";

export default function Fournisseur() {
  const [formData, setFormData] = useState({ nom: "", adresse: "", telephone: "" });
  const [showForm, setShowForm] = useState(false);
  const [editForm, setEditForm] = useState(false);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({}); 
  const token = localStorage.getItem("token");
  const { q } = useOutletContext();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filtered = fournisseurs.filter(p =>
    p.nom.toLowerCase().includes(q.toLowerCase())
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
  const fetchFournisseurs = useCallback(async () => {
    try {
      const res = await fetch("/api/fournisseur", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setFournisseurs(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des fournisseurs :", error);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchFournisseurs();
  }, [token, fetchFournisseurs]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submit = async (e) => {
    e.preventDefault();
   const res = await fetch("/api/fournisseur", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });
    if (!res.ok) {
       const errorData = await res.json();
    setErrors(errorData.errors || {});
    throw new Error(errorData.message || "Échec de connexion");
    }
    toast.success("Nouveau fournisseur enregistré avec succes");
    setFormData({ nom: "", adresse: "", telephone: "" });
    setShowForm(false);
    fetchFournisseurs();
  };

  const supprimer = async (id) => {
    try {
      await fetch(`/api/fournisseur/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      toast.success("Fournisseur supprimé avec succes");
      fetchFournisseurs();
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
    }
  };

  const startEdit = (fournisseur) => {
    setFormData({ nom: fournisseur.nom, adresse: fournisseur.adresse, telephone: fournisseur.telephone });
    setEditingId(fournisseur.id);
    setEditForm(true);
  };

  const edit = async (e) => {
    e.preventDefault();
    if (!editingId) return;

   const res = await fetch(`/api/fournisseur/${editingId}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });
    if (!res.ok) {
       const errorData = await res.json();
    setErrors(errorData.errors || {});
    throw new Error(errorData.message || "Échec de connexion");
    }
    toast.success("Fournisseur mis a jour avec succes");
    setFormData({ nom: "", adresse: "", telephone: ""  });
    setEditingId(null);
    setEditForm(false);
    fetchFournisseurs();
  };

  return (
    <>
    <Toaster position="top-right" />
      <button
        onClick={() => setShowForm(!showForm)} className="mb-4 px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg transition duration-150">
        Ajouter
      </button>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-4">Nom </th>
              <th className="px-6 py-4">Adresse</th>
              <th className="px-6 py-4">Telephone</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((fournisseur, index) => (
              <tr key={index} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{fournisseur.nom}</td>
                <td className="px-6 py-4">{fournisseur.adresse}</td>
                <td className="px-6 py-4">{fournisseur.telephone}</td>
                <td className="flex gap-2 px-6 py-4">
                  <a onClick={() => startEdit(fournisseur)} className="font-medium text-blue-600 dark:text-blue-500 cursor-pointer"><MdEdit /></a>
                  <a onClick={() => supprimer(fournisseur.id)} className="font-medium text-red-600 dark:text-red-500 cursor-pointer"><MdDeleteSweep /></a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <form onSubmit={submit} className="flex flex-col gap-2">
              <input type="text" name="nom" value={formData.nom} onChange={handleChange} placeholder="Nom" className="form-control w-full px-3 py-1.5 border rounded" required />
              {errors.nom && <p className="text-red-500">{errors.nom[0]}</p>}
              <input type="text" name="adresse" value={formData.adresse} onChange={handleChange} placeholder="Adresse" className="form-control w-full px-3 py-1.5 border rounded" required />
              {errors.adresse && <p className="text-red-500">{errors.adresse[0]}</p>}
            <input type="text" name="telephone" value={formData.telephone} onChange={handleChange} placeholder="Telephone" className="form-control w-full px-3 py-1.5 border rounded" required />
            {errors.telephone && <p className="text-red-500">{errors.telephone[0]}</p>}
              <div className="flex gap-4 mt-4">
                <button type="submit" className="flex-1 px-6 py-2.5 bg-blue-600 text-white rounded">Ajouter</button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-6 py-2.5 bg-red-400 text-white rounded">Annuler</button>
              </div>
            </form>
          </div>
        </div>
        
      )}

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

      {editForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <form onSubmit={edit} className="flex flex-col gap-2">
              <input type="text" name="nom" value={formData.nom} onChange={handleChange} placeholder="Nom" className="form-control w-full px-3 py-1.5 border rounded" required />
              {errors.nom && <p className="text-red-500">{errors.nom[0]}</p>}
              <input type="text" name="adresse" value={formData.adresse} onChange={handleChange} placeholder="Adresse" className="form-control w-full px-3 py-1.5 border rounded" required />
              {errors.adresse && <p className="text-red-500">{errors.adresse[0]}</p>}
            <input type="text" name="telephone" value={formData.telephone} onChange={handleChange} placeholder="Telephone" className="form-control w-full px-3 py-1.5 border rounded" required />
            {errors.telephone && <p className="text-red-500">{errors.telephone[0]}</p>}
              <div className="flex gap-4 mt-4">
                <button type="submit" className="flex-1 px-6 py-2.5 bg-blue-600 text-white rounded">Modifier</button>
                <button type="button" onClick={() => setEditForm(false)} className="flex-1 px-6 py-2.5 bg-red-400 text-white rounded">Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
