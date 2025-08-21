import { useEffect, useState } from "react";
import './pharmacie.css'
import { MdDeleteSweep } from "react-icons/md";
import { FaCartPlus } from "react-icons/fa";

export default function Pharmacie(){
  const [categories, setCategories] = useState([]);
  const [produits, setProduits] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const token = localStorage.getItem("token");
  

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
    fetchCategories(fetchCategories);
  }, [token]);

  const selectCategory = (category) => {
    setSelectedCategory(category);
  };

  const addToCart = (produit) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === produit.id);
      if (existing) {
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
      items: cart.map(item => ({
        produit_id: item.id,
        qty: item.qty,
        prix_unitaire: item.prix_unitaire,
        total: item.prix_unitaire * item.qty
      })),
      total_general: cart.reduce((acc, item) => acc + item.prix_unitaire * item.qty, 0)
    };

    const res = await fetch('http://localhost:8000/api/vente', {
      method: 'POST',
       headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      body: JSON.stringify(donne)
    });

    if (!res.ok) {
      throw new Error("Erreur lors de l'enregistrement de la vente");
    }

    const data = await res.json();
    console.log("Vente enregistrée :", data);

    setCart([]);

  } catch (error) {
    console.error("Erreur :", error);
  }
};
    return(
        <>
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
    

      <div className="flex flex-wrap justify-start">
  {produits
    .filter(p => !selectedCategory || p.category_id === selectedCategory.id)
    .map((produit) => (
      <div key={produit.id} className="w-[150px] h-[185px] rounded-lg overflow-hidden shadow-md bg-white m-3 transition-transform duration-200 hover:scale-105">
        <img src={`http://localhost:8000/uploads/products/${produit.image}`} alt="Card" className="w-full h-[110px] object-cover" />
        <div className="p-2">
          <h3 className="text-sm font-semibold">{produit.nom}</h3>
          <p className="text-xs text-gray-600 truncate">{produit.description}</p>
          <button onClick={() => addToCart(produit)} className="mt-2 bg-green-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700"><FaCartPlus />
          </button>
        </div>
      </div>
    ))}
</div>
</div>

{/*panier*/}

<div className="bg-white shadow-lg rounded-xl p-6 w-full md:w-1/3">
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
              <p className="text-xs text-gray-600">Prix : {format(item.prix_unitaire)}</p>

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
                  <span className="font-bold text-gray-800 text-sm">
                    {format(item.prix_unitaire * item.qty)}
                  </span>
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
          {cart.reduce((acc, item) => acc + item.prix_unitaire * item.qty, 0)}
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