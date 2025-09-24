import { useEffect, useState } from "react";
import './pharmacie.css'
import { MdDeleteSweep } from "react-icons/md";
import { FaCartPlus } from "react-icons/fa";
import { useOutletContext } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function Pharmacie(){
  const [categories, setCategories] = useState([]);
  const [produits, setProduits] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const token = localStorage.getItem("token");
  const { q } = useOutletContext();

  const filtered = produits.filter(p =>
     (!q || p.nom.toLowerCase().includes(q.toLowerCase())) &&
  (!selectedCategory || p.categorie_id === selectedCategory.id)
  );

  useEffect(() => {
    const fetchProduits = async () => {
    try {
      const res = await fetch("/api/produit", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      const data = await res.json();
      setProduits(data);
      setIsLoading(false);
      setLoading(false);
    
    } catch (error) {
      console.error("Erreur lors de la récupération des produits :", error);
    }
  };
      fetchProduits();
    }, [token]);
    
   useEffect(() => {
      const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categorie", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      const data = await res.json();
      setCategories(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories :", error);
    }
  };
    fetchCategories();
  }, [token]);

  const selectCategory = (categorie) => {
    setSelectedCategory(categorie);
  };

  const addToCart = (produit) => {
  if (produit.niveau_en_stock <= 0) {
    toast.error("Quantité insuffisante en stock !");
    return;
  }

  setCart(prevCart => {
    const existing = prevCart.find(item => item.id === produit.id);
    if (existing) {
      if (existing.qty + 1 > produit.niveau_en_stock) {
        toast.error("Vous ne pouvez pas ajouter plus que le stock disponible !");
        return prevCart;
      }
      return prevCart.map(item =>
        item.id === produit.id ? { ...item, qty: item.qty + 1 } : item
      );
    }
    return [...prevCart, { ...produit, qty: 1 }];
  });
};

  const removeFromCart = (produitId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== produitId));
  };

  const updateQty = (produitId, delta) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === produitId
          ? { ...item, qty: Math.max(1, item.qty + delta) }
          : item
      )
    );
  };

  const format = (amount) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
  }).format(amount);
};

const enregistrer = async () => {
  try {
    const donne = {
  produits: cart.map(item => ({
    id: item.id,
    quantite: item.qty,
  })),
  total_general: cart.reduce((acc, item) => acc + item.prix_unitaire * item.qty, 0)
};

    const res = await fetch("http://localhost:8000/api/vente", {
      method: 'POST',
       headers: { 
         accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
       },
      body: JSON.stringify(donne)
    });

    if (!res.ok) {
      throw new Error("Erreur lors de l'enregistrement de la vente");
    }

    const data = await res.json();
    console.log("Vente enregistrée :", data);
      toast.success("Vente enregistré");


    setCart([]);

  } catch (error) {
    console.error("Erreur :", error);
  }
};

    return(
        <>
        <Toaster position="top-right" />
      <div className="flex gap-2 mt-4">
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-4 uppercase">Pharmacie</h2>

      {!isLoading && (
        <div className="mb-4">
          <div id="myBtnContainer" className="flex flex-wrap gap-2">
            <button className={`btn ${!selectedCategory ? 'active' : ''}`} onClick={() => selectCategory(null)}>
              Tous
            </button>

            {categories.map((categorie) => (
              <button
                key={categorie.id}
                className={`btn ${selectedCategory === categorie ? 'active' : ''}`} onClick={() => selectCategory(categorie)}>
                {categorie.nom}
              </button>
            ))}
          </div>
        </div>
      )}
    
       {loading ? (
          <div role="status">
            <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        ) : (
      <div className="flex flex-wrap justify-start">
  {filtered
    .map((produit) => (
      <div key={produit.id} className="w-[150px] h-[185px] rounded-lg overflow-hidden shadow-md bg-white m-3 transition-transform duration-200 hover:scale-105">
        <img src={`http://localhost:8000/uploads/products/${produit.image}`} alt="Card" className="w-full h-[110px] bg-cover" />
        <div className="p-2">
          <h3 className="text-sm font-semibold">{produit.nom}</h3>
          <p className="text-xs text-gray-600 truncate">{produit.description}</p>
          <button onClick={() => addToCart(produit)} className="mt-2 bg-green-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700"><FaCartPlus />
          </button>
        </div>
      </div>
    ))}
</div>
        )}
</div>

{/*panier*/}

<div className="bg-white shadow-lg rounded-xl p-2 w-full md:w-1/3">
  <h3 className="text-xl font-bold mb-4 border-b pb-2">🛒 Votre panier</h3>

  {cart.length === 0 ? (
    <p className="text-gray-500 text-center">Votre panier est vide</p>
  ) : (
    <>
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {cart.map(item => (
          <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg shadow-sm">
            <img src={`http://localhost:8000/uploads/products/${item.image}`} alt={item.nom} className="w-16 h-16 object-cover rounded-md border"/>

            <div className="flex-1">
              <h4 className="text-sm font-semibold">{item.nom}</h4>
              <p className="text-xs text-gray-600"> {format(item.prix_unitaire)}</p>

              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQty(item.id, -1)} className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded-full text-sm">
                    −
                  </button>
                  <span className="px-2 font-medium">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)} className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded-full text-sm">
                    +
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  
                  <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700">
                    <MdDeleteSweep size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t pt-4 flex justify-between font-bold text-lg">
        <span>Total :</span>
        <span>
          {format(cart.reduce((acc, item) => acc + item.prix_unitaire * item.qty, 0))}
        </span>
      </div>

      <button onClick={enregistrer} className="w-full mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition">
        Valider 
      </button>
    </>
  )}
</div>
      </div>
        </>
    )
}