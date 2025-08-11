import { useEffect, useState } from "react";
import './pharmacie.css'

export default function Pharmacie(){
  const [categories, setCategories] = useState([]);
  const [produits, setProduits] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProduits = async () => {
    try {
      const res = await fetch("/api/produit");
      const data = await res.json();
      setProduits(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des produits :", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categorie");
      const data = await res.json();
      setCategories(data);
      setIsLoading(false);
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

  const selectCategory = (category) => {
    setSelectedCategory(category);
  };

    return(
        <>
      <div className="flex gap-4 mt-4">
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
    </div>

      <div className="flex flex-wrap justify-start">
  {produits
    .filter(p => !selectedCategory || p.category_id === selectedCategory.id)
    .map((produit) => (
      <div key={produit.id} className="w-[150px] h-[200px] rounded-lg overflow-hidden shadow-md bg-white m-5 transition-transform duration-200 hover:scale-105">
        <img src={produit.image} alt="Card" className="w-full h-[120px] object-cover" />
        <div className="p-2">
          <h3 className="text-sm font-semibold">{produit.nom}</h3>
          <p className="text-xs text-gray-600 truncate">{produit.description}</p>
          <button className="mt-2 bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700">
            Voir plus
          </button>
        </div>
      </div>
    ))}
</div>

{/*panier*/}

 <div className="bg-white shadow-md p-4 rounded-lg mb-4" >
  <div className="flex flex-col md:flex-row gap-4">
    <img className="w-24 h-24 object-cover rounded-md"/>
    <div className="flex-1">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold"></h4>
        <div className="flex items-center gap-2">
          <button  className="px-2 py-1 bg-gray-200 rounded">−</button>
          <span></span>
          <button  className="px-2 py-1 bg-gray-200 rounded">+</button>
        </div>
      </div>
      {cart.map(item => (
        <div key={item.id}>
          <h4>{item.nom}</h4>
          <p>Prix : {item.prix}  XOF</p>
        </div>
          ))}
      <div className="flex justify-between items-center mt-2">
        <div className="flex gap-2">
          <a className="text-red-600 text-sm hover:underline"><MdDeleteSweep /></a>
          <button  className="text-blue-600 text-sm hover:underline">
            <i className="fa fa-heart mr-1"></i> 
          </button>
        </div>
        <span className="font-bold text-gray-800"></span>
      </div>
    </div>
  </div>
</div>
</div>
        </>
    )
}