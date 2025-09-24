import { useCallback, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { MdDeleteSweep, MdEdit } from "react-icons/md";
import { useOutletContext } from "react-router-dom";

export default function Users() {
const [formData, setFormData] = useState({ name: "", email: "", role_id: "" });
  const [showForm, setShowForm] = useState(false);
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(false);
  const { q } = useOutletContext();
  const [errors, setErrors] = useState({});

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(q.toLowerCase())
  );

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:8000/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateur :", error);
    }
  },[token]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setErrors({});
    console.log(formData);
    try{
    const res = await fetch("http://127.0.0.1:8000/api/users", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
       },
      body: JSON.stringify(formData)
    });
    if (!res.ok) {
        const errorData = await res.json();
        setErrors(errorData.errors || {});
    throw new Error(errorData.message || "Échec de connexion");
     
    }
    toast.success("Nouvel utilisateur crée avec succes");
    setFormData({ name: "", email: "", role_id: ""  });
    setShowForm(false);
    fetchUsers();
  }catch (err) {
    console.error(err);
   } };
  const [roles, setRoles] = useState([]);

const fetchRoles = useCallback(async () => {
  const res = await fetch("http://localhost:8000/api/roles", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  const data = await res.json();
  setRoles(data);
},[token]);

useEffect(() => {
  if(token){
  fetchUsers();
  fetchRoles();
  }
}, [token, fetchRoles, fetchUsers]);

 const supprimer = async (id) => {
  try {
    await fetch(`http://localhost:8000/api/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    toast.success("Vous venez de supprimer cet utilisateur");
    fetchUsers(); 
  } catch (err) {
    console.error("Erreur lors de la suppression :", err);
  }
};

const startEdit = (user) => {
    setFormData({ name: user.name, email: user.email,  role_id: user.roles?.[0]?.id || "", });
    setEditingId(user.id);
    setEditForm(true);
  };

  const edit = async (e) => {
    e.preventDefault();
    if (!editingId) return;

   const res = await fetch(`http://localhost:8000/api/users/${editingId}`, {
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
    toast.success("Vous avez modifier cet utilisateur");
    setFormData({ name: "", email: "", role_id:"" });
    setEditingId(null);
    setEditForm(false);
    fetchUsers();
  };

  return (
   <> 
   <Toaster position="top-right" />
<button
        onClick={() => setShowForm(!showForm)}
        className="mb-4 px-6 py-2.5  bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg transition duration-150 ">
        Créer
    </button>
<div className="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" className="px-6 py-4">
                    Nom de l'utilisateur
                </th>
                <th scope="col" className="px-6 py-4">
                    Email
                </th>
                <th scope="col" className="px-6 py-4">
                    Role
                </th>
                <th scope="col" className="px-6 py-4">
                    Action
                </th>
            </tr>
        </thead>
        <tbody>
        {filtered.map((user, index) => (
            <tr key={index} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {user.name}
            </th>
            <td className="px-6 py-4">
                {user.email}
            </td>
            <td className="px-6 py-4">
                {user.roles?.map(r => r.name).join(", ")}
            </td>
            <td className="flex gap-2 px-6 py-4">
                <a onClick={() => startEdit(user)} className="font-medium text-blue-600 dark:text-blue-500 cursor-pointer "><MdEdit /></a>
                <a onClick={() => supprimer(user.id)} className="font-medium text-red-600 dark:text-red-500 cursor-pointer "><MdDeleteSweep /></a>
            </td>
            </tr>
        ))}
        </tbody>
    </table>
</div>
     {showForm && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <form  onSubmit={submit} className='flex flex-col gap-2' >
          
                <div className="form-group mb-6">
                  <input type='text' name='name' value={formData.name} onChange={handleChange} className="form-control w-full px-3 py-1.5 text-base font-normal  text-gray-700  bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0  focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" placeholder=" Nom" required />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name[0]}</p>}
                </div>
                 <div className="form-group mb-6">
                  <input type='text' name='email' value={formData.email} onChange={handleChange} className="form-control w-full px-3 py-1.5 text-base font-normal  text-gray-700  bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0  focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" placeholder=" Email" required />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email[0]}</p>}
                </div>
              
                <div className="form-group mb-6">
                   <select id="role_id" name="role_id" value={formData.role_id}  onChange={handleChange} 
                    className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700">
                    <option value="" >-- Sélectionner le role --</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
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

      {editForm && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <form  onSubmit={edit} className='flex flex-col gap-2' >
          
                <div className="form-group mb-6">
                  <input type='text' name='name' value={formData.name} onChange={handleChange} className="form-control w-full px-3 py-1.5 text-base font-normal  text-gray-700  bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0  focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"  />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name[0]}</p>}
                </div>
                 <div className="form-group mb-6">
                  <input type='text' name='email' value={formData.email} onChange={handleChange} className="form-control w-full px-3 py-1.5 text-base font-normal  text-gray-700  bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0  focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"  />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email[0]}</p>}
                </div>
                
                <div className="form-group mb-6">
                   <select id="role_id" name="role_id" value={formData.role_id}  onChange={handleChange} 
                    className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700">
                    <option value="" >-- Sélectionner le role --</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                  {errors.role_id && <p className="text-red-500 text-sm">{errors.role_id[0]}</p>}
                </div>

                <div className="flex gap-4 mt-4">
                  <button type="submit" className="flex-1 px-6 py-2.5 bg-blue-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg gap-10">
                  Modifier
                  </button>

                  <button onClick={() => {  setEditForm(false); setFormData({ name: "", email: "", role_id: "" });}} className="flex-1 px-6 py-2.5 bg-red-400 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-red-500 hover:shadow-lg ">
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
