import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './Pages/Home'
import Pharmacie from './Pages/Pharmacie'
import './App.css'
import Produits from './Pages/Produits'
import Categories from './Pages/Categories'
import Paiement from './Pages/Paiement'
import Login from './Pages/Authentification'
import Users from './Pages/Utilisateur'
import PrivateRoute from './components/Route'
import Stock from './Pages/Stock'
import Fournisseur from './Pages/Fournisseur'
import Commande from './Pages/Commande'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/authentification" element={<Login />} />

        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="pharmacie" element={<Pharmacie />} />
            <Route path="produits" element={<Produits />} />
            <Route path="categories" element={<Categories />} />
            <Route path="paiement" element={<Paiement />} />
            <Route path="utilisateurs" element={<Users />} />
            <Route path="stock" element={<Stock />} />
            <Route path="fournisseur" element={<Fournisseur />} />
            <Route path="commande" element={<Commande />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
