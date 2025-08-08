import { useEffect, useState } from "react";
import { MdDeleteSweep, MdEdit } from "react-icons/md";

export default function Produits() {

    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({image: null, nom: "", description: "", prix_unitaire: "", niveau_en_stock: "", categorie_id: "" });
    const [produits, setProduits] = useState([]);
    const [categories, setCategories] = useState([]);

    const fetchProduits = async () => {
    try {
      const res = await fetch("/api/produit");
      const data = await res.json();
      setProduits(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des produits :", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categorie");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories :", error);
    }
  };

  useEffect(() => {
      fetchProduits();
    }, []);
    
   useEffect(() => {
    fetchCategories();
  }, []);

   const submit = async (e) => {
  e.preventDefault();

  const data = new FormData();
  data.append("nom", formData.nom);
  data.append("description", formData.description);
  data.append("prix_unitaire", formData.prix_unitaire);
  data.append("niveau_en_stock", formData.niveau_en_stock);
  data.append("categorie_id", formData.categorie_id);
  data.append("image", formData.image); // fichier !

  try {
    const res = await fetch("/api/produit", {
      method: "POST",
      body: data, // FormData ici
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Erreurs de validation :", errorData.errors);
      return;
    }

    setFormData({
      image: null,
      nom: "",
      description: "",
      prix_unitaire: "",
      niveau_en_stock: "",
      categorie_id: "",
    });
    setShowForm(false);
    fetchProduits();
  } catch (error) {
    console.error("Erreur réseau :", error);
  }
};
 

const handleChange = (e) => {
  const { name, type, value, files } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: type === "file" ? files[0] : value,
  }));
};
  return (
   <> 
   
<button
        onClick={() => setShowForm(!showForm)}
        className="mb-4 px-6 py-2.5  bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg transition duration-150 ">
        Créer
    </button>
<div className="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" className="px-6 py-3">
                    Image
                </th>
                <th scope="col" className="px-6 py-3">
                    Nom
                </th>
                <th scope="col" className="px-6 py-3">
                    Description
                </th>
                <th scope="col" className="px-6 py-3">
                    Prix unitaire
                </th>
                <th scope="col" className="px-6 py-3">
                    Niveau en stock
                </th>
                 <th scope="col" className="px-6 py-3">
                    Catégorie
                </th>
                <th scope="col" className="px-6 py-3">
                    Action
                </th>
            </tr>
        </thead>
        <tbody>
                {produits.map((produit, index) => (
                    <tr key={index} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
                      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {produit.image}
                    </th>
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {produit.name}
                    </th>
                    <td className="px-6 py-4">
                        {produit.description}
                    </td>
                    <td className="flex gap-2 px-6 py-4">
                        <a href="#" className="font-medium text-blue-600 dark:text-blue-500 "><MdEdit /></a>
                        <a href="#" className="font-medium text-red-600 dark:text-blue-500 "><MdDeleteSweep /></a>
                    </td>
                    </tr>
                ))}
                </tbody>
    </table>
</div>
     {showForm && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <form onSubmit={submit} className='flex flex-col gap-2' enctype="multipart/form-data">
          
                <div className="form-group mb-6">
                  <input type='text' name='nom' value={formData.nom} onChange={handleChange} className="form-control w-full px-3 py-1.5 text-base font-normal  text-gray-700  bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0  focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" placeholder=" Nom"   />
                </div>

                 <div className="form-group mb-6">
                  <input type='text' name='description' value={formData.description} onChange={handleChange} className="form-control w-full px-3 py-1.5 text-base font-normal  text-gray-700  bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0  focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" placeholder="Description"   />
                </div>
                 <div className="form-group mb-6">
                  <input type='text' name='prix_unitaire' value={formData.prix_unitaire} onChange={handleChange} className="form-control w-full px-3 py-1.5 text-base font-normal  text-gray-700  bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0  focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" placeholder="Prix unitaire"   />
                </div>
                 <div className="form-group mb-6">
                  <input type='text' name='niveau_en_stock' value={formData.niveau_en_stock} onChange={handleChange} className="form-control w-full px-3 py-1.5 text-base font-normal  text-gray-700  bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0  focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" placeholder=" Niveau en stock"   />
                </div>
                 <div className="form-group mb-6">
                   <select id="categorie_id" name="categorie_id" value={formData.categorie_id}  onChange={handleChange} 
                    className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700">
                    <option >-- Sélectionner une catégorie --</option>
                    {categories.map((categorie) => (
                      <option key={categorie.id} value={categorie.id}>
                        {categorie.nom}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group mb-6">
                  <input type='file' id="image" name='image' accept="image/*" onChange={handleChange} className="form-control w-full px-3 py-1.5 text-base font-normal  text-gray-700  bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0  focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"    />
                </div>

                <div className="flex gap-4 mt-4">
                  <button type="submit" className="flex-1 px-6 py-2.5 bg-blue-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg gap-10">
                  Ajouter
                  </button>

                  <button onClick={() => setShowForm(false)} className="flex-1 px-6 py-2.5 bg-red-400 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-red-500 hover:shadow-lg ">
                      Annuler
                  </button>
                </div>
          
        </form> 
      </div>
    </div>
     )}
    </>
  );
}
