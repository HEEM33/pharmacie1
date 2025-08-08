import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './Pages/Home'
import Pharmacie from './Pages/Pharmacie'
import './App.css'
import Produits from './Pages/Produits'
import Categories from './Pages/Categories'
import Paiement from './Pages/Paiement'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/pharmacie" element={<Pharmacie />} />
          <Route path="/produits" element={<Produits />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/paiement" element={<Paiement />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
