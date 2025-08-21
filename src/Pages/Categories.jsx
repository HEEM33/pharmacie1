import { useCallback, useEffect, useState } from "react";
import { MdDeleteSweep, MdEdit } from "react-icons/md";

export default function Categories() {
  const [formData, setFormData] = useState({ nom: "", description: "" });
  const [showForm, setShowForm] = useState(false);
  const [editForm, setEditForm] = useState(false);
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null); 
  const token = localStorage.getItem("token");

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/categorie", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories :", error);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchCategories();
  }, [token, fetchCategories]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    await fetch("/api/categorie", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });
    setFormData({ nom: "", description: "" });
    setShowForm(false);
    fetchCategories();
  };

  const supprimer = async (id) => {
    try {
      await fetch(`/api/categorie/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      fetchCategories();
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
    }
  };

  const startEdit = (categorie) => {
    setFormData({ nom: categorie.nom, description: categorie.description });
    setEditingId(categorie.id);
    setEditForm(true);
  };

  const edit = async (e) => {
    e.preventDefault();
    if (!editingId) return;

    await fetch(`/api/categorie/${editingId}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    setFormData({ nom: "", description: "" });
    setEditingId(null);
    setEditForm(false);
    fetchCategories();
  };

  return (
    <>
      <button
        onClick={() => setShowForm(!showForm)} className="mb-4 px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg transition duration-150">
        Créer
      </button>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-4">Nom de la catégorie</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((categorie, index) => (
              <tr key={index} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
                <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{categorie.nom}</th>
                <td className="px-6 py-4">{categorie.description}</td>
                <td className="flex gap-2 px-6 py-4">
                  <a onClick={() => startEdit(categorie)} className="font-medium text-blue-600 dark:text-blue-500 cursor-pointer"><MdEdit /></a>
                  <a onClick={() => supprimer(categorie.id)} className="font-medium text-red-600 dark:text-red-500 cursor-pointer"><MdDeleteSweep /></a>
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
              <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="form-control w-full px-3 py-1.5 border rounded"></textarea>
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
              <input type="text" name="nom" value={formData.nom} onChange={handleChange} className="form-control w-full px-3 py-1.5 border rounded" />
              <textarea name="description" value={formData.description} onChange={handleChange} className="form-control w-full px-3 py-1.5 border rounded"></textarea>
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
