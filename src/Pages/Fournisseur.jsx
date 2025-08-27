import { useCallback, useEffect, useState } from "react";
import { MdDeleteSweep, MdEdit } from "react-icons/md";
import { useOutletContext } from "react-router-dom";

export default function Fournisseur() {
  const [formData, setFormData] = useState({ nom: "", adresse: "", telephone: "" });
  const [showForm, setShowForm] = useState(false);
  const [editForm, setEditForm] = useState(false);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [editingId, setEditingId] = useState(null); 
  const token = localStorage.getItem("token");
  const { q } = useOutletContext();

  const filtered = fournisseurs.filter(p =>
    p.nom.toLowerCase().includes(q.toLowerCase())
  );
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
    await fetch("/api/fournisseur", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });
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

    await fetch(`/api/fournisseur/${editingId}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    setFormData({ nom: "", adresse: "", telephone: ""  });
    setEditingId(null);
    setEditForm(false);
    fetchFournisseurs();
  };

  return (
    <>
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
            {filtered.map((fournisseur, index) => (
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
              <input type="text" name="nom" value={formData.nom} onChange={handleChange} placeholder="Nom" className="form-control w-full px-3 py-1.5 border rounded" />
              <input type="text" name="adresse" value={formData.adresse} onChange={handleChange} placeholder="Adresse" className="form-control w-full px-3 py-1.5 border rounded"/>
            <input type="text" name="telephone" value={formData.telephone} onChange={handleChange} placeholder="Telephone" className="form-control w-full px-3 py-1.5 border rounded"/>
              <div className="flex gap-4 mt-4">
                <button type="submit" className="flex-1 px-6 py-2.5 bg-blue-600 text-white rounded">Ajouter</button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-6 py-2.5 bg-red-400 text-white rounded">Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <form onSubmit={edit} className="flex flex-col gap-2">
              <input type="text" name="nom" value={formData.nom} onChange={handleChange} placeholder="Nom" className="form-control w-full px-3 py-1.5 border rounded" />
              <input type="text" name="adresse" value={formData.adresse} onChange={handleChange} placeholder="Adresse" className="form-control w-full px-3 py-1.5 border rounded"/>
            <input type="text" name="telephone" value={formData.telephone} onChange={handleChange} placeholder="Telephone" className="form-control w-full px-3 py-1.5 border rounded"/>
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
