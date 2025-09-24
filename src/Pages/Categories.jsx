import { useCallback, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { MdDeleteSweep, MdEdit } from "react-icons/md";
import { useOutletContext } from "react-router-dom";

export default function Categories() {
  const [formData, setFormData] = useState({ nom: "", description: "" });
  const [showForm, setShowForm] = useState(false);
  const [editForm, setEditForm] = useState(false);
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const token = localStorage.getItem("token");
  const { q } = useOutletContext();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filtered = categories.filter(c =>
    c.nom.toLowerCase().includes(q.toLowerCase())
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

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/categorie", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCategories(data);
      setLoading(false)
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
    const res = await fetch("/api/categorie", {
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
    toast.success("Categorie ajouter avec succes");
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
      toast.success("Categorie supprimé avec succes");
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

   const res = await fetch(`/api/categorie/${editingId}`, {
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
    toast.success("Categorie mis a jour");
    setFormData({ nom: "", description: "" });
    setEditingId(null);
    setEditForm(false);
    fetchCategories();
  };

  

  return (
    <>
     <Toaster position="top-right" />
      <button
        onClick={() => setShowForm(!showForm)} className="mb-4 px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg transition duration-150">
        Créer
      </button>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        {loading ? (
          <div role="status">
            <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        ) : (
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-4">Nom de la catégorie</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          
          <tbody>
            {currentItems.map((categorie, index) => (
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
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <form onSubmit={submit} className="flex flex-col gap-2">
              <input type="text" name="nom" value={formData.nom} onChange={handleChange} placeholder="Nom" className="form-control w-full px-3 py-1.5 border rounded" required />
              {errors.nom && <p className="text-red-500">{errors.nom[0]}</p>}
              <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="form-control w-full px-3 py-1.5 border rounded" required ></textarea>
              {errors.description && <p className="text-red-500">{errors.description[0]}</p>}
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
              <input type="text" name="nom" value={formData.nom} onChange={handleChange} className="form-control w-full px-3 py-1.5 border rounded" required />
              <textarea name="description" value={formData.description} onChange={handleChange} className="form-control w-full px-3 py-1.5 border rounded" required ></textarea>
              <div className="flex gap-4 mt-4">
                <button type="submit" className="flex-1 px-6 py-2.5 bg-blue-600 text-white rounded">Modifier</button>
                <button type="button" onClick={() => { setEditForm(false); setFormData({ nom: "", description: "" });}} className="flex-1 px-6 py-2.5 bg-red-400 text-white rounded">Annuler</button>
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
    </>
  );
}
