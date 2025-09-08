import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";

export default function Login(){
    const [formData, setFormData] = useState({ email: "", password: "" });
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const { login } = useContext(AuthContext);

     const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const submit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("http://localhost:8000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    

    const data = await res.json();
    if (!res.ok) {
       const errorData = await res.json();
    setErrors(errorData.errors || {});
    throw new Error(errorData.message || "Échec de connexion");
    }

    login(data.access_token, data.user, data.roles);

    setTimeout(() => {
      navigate("/");
    }, 50);
    
  } catch (err) {
    console.error(err.message);
  }
};


    return(
        <>
       <div className="flex items-center min-h-screen p-4 bg-gray-100 lg:justify-center">
      <div className="flex flex-col overflow-hidden bg-white rounded-md shadow-lg max md:flex-row md:flex-1 lg:max-w-screen-md">
        <div className="p-4 py-6 text-white  md:w-80 md:flex-shrink-0 md:flex md:flex-col md:items-center md:justify-evenly  bg-cover" style={{ backgroundImage: "url('/pharmacien.png')" }}>          
        </div>
        <div className="p-5 bg-white md:flex-1">
          <h3 className="my-4 text-2xl font-semibold text-gray-700">Connexion au compte</h3>
          <form onSubmit={submit} className="flex flex-col space-y-5">
            <div className="flex flex-col space-y-1">
              <label htmlFor="email" className="text-sm font-semibold text-gray-500">Adresse email</label>
              <input type="email" id="email" name="email" value={formData.email}  onChange={handleChange} autoFocus className="px-4 py-2 transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200" required />
              {errors.email && <p className="text-red-500">{errors.email[0]}</p>}
            </div>
            <div className="flex flex-col space-y-1">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-semibold text-gray-500">Mot de passe</label>
                <a href="/reset" className="text-sm text-blue-600 hover:underline focus:text-blue-800">Mot de passe oublié?</a>
              </div>
              <input type="password" id="password" name="password" value={formData.password}  onChange={handleChange} className="px-4 py-2 transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200" required />
              {errors.password && <p className="text-red-500">{errors.password[0]}</p>}
            </div>
            <div className="flex items-center space-x-2">  
              <input type="checkbox" id="remember" className="w-4 h-4 transition duration-300 rounded focus:ring-2 focus:ring-offset-0 focus:outline-none focus:ring-blue-200"/>
              <label htmlFor="remember" className="text-sm font-semibold text-gray-500">Se souvenir</label>
            </div>
            <div>
              <button type="submit" className="w-full px-4 py-2 text-lg font-semibold text-white transition-colors duration-300 bg-blue-500 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-blue-200 focus:ring-4">
                CONNEXION
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
    </> 
    )
  }


