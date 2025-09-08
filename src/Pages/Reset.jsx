import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Reset() {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({email: ""});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8000/api/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors(data.errors || {});
        throw new Error(data.message || "Échec de la réinitialisation");
      }
      toast.success("Votre mot de passe a ete reinitialise ");
      setTimeout(() => {
        navigate("/authentification");
      }, 50);
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <>
    <Toaster position="top-right" />
    <div className="flex items-center min-h-screen p-4 bg-gray-100 lg:justify-center">
      <div className="p-5 bg-white ">
       <h3 className="my-4 text-2xl font-semibold text-gray-700">Reinitilisation du mot de passe</h3>
    <form onSubmit={submit} className="flex flex-col space-y-5">
      <div className="flex flex-col space-y-1">
        <label htmlFor="email" className="text-sm font-semibold text-gray-500">
          Adresse email
        </label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} autoFocus className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-4 focus:ring-blue-200" required/>
        {errors.email && <p className="text-red-500">{errors.email[0]}</p>}
      </div>

      <div>
        <button type="submit" className="w-full px-4 py-2 text-lg font-semibold text-white bg-blue-500 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-200">
          Réinitialiser
        </button>
      </div>
    </form>
    </div>
    </div>
    </>
  );
}
