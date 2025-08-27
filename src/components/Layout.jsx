import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'

import { MdGroupAdd, MdMenuOpen, MdNotificationsNone, MdReceiptLong } from "react-icons/md"
import { IoHomeOutline } from "react-icons/io5"
import { FaBoxes, FaCashRegister, FaHandHoldingMedical, FaProductHunt, FaTruck, FaUserCircle } from "react-icons/fa"
import { TbBrandStocktwits, TbCategoryPlus, TbReportSearch } from "react-icons/tb"
import { IoLogoBuffer } from "react-icons/io"
import { CiSearch, CiSettings } from "react-icons/ci"
import { MdOutlineDashboard } from "react-icons/md"
import { AuthContext } from './AuthContext'
import { BsUpcScan } from 'react-icons/bs'
import { AiOutlineUnorderedList } from 'react-icons/ai'

const menuItems = [
  { icon: <MdOutlineDashboard size={20} />, label: 'Dashboard', path: 'dashboard' },
  { icon: <MdGroupAdd  size={20} />, label: 'Utilisateur', path: 'utilisateurs' },
  { icon: <BsUpcScan size={20} />, label: 'Log' },
  { icon: <FaCashRegister size={20} />, label: 'Paiement', path: 'paiement' },
  { icon: <FaHandHoldingMedical size={20} />, label: 'Pharmacie', path: 'pharmacie' },
  { icon: <FaProductHunt size={20} />, label: 'Produits', path: 'produits'  },
  { icon: <TbCategoryPlus size={20} />, label: 'Categories', path: 'categories'  },
  { icon: <FaBoxes size={20} />, label: 'Stocks', path: 'stock'  },
  { icon: <MdReceiptLong size={20} />, label: 'Commande', path: 'commande'  },
  { icon: <FaTruck size={20} />, label: 'Fournisseur', path: 'fournisseur'  },
]

export default function Layout() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)     
  const [q, setQ] = useState("")                          
  const inputRef = useRef(null) 
  const navigate = useNavigate();
  const { token, user, logout } = useContext(AuthContext);
  const [alertes, setAlertes] = useState([]);
   const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    if (token) {
      fetch("http://localhost:8000/api/alerte", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => res.json())
      .then(data => setAlertes(data.produits || []))
      .catch(err => console.error("Erreur récupération alertes :", err))
    }
  }, [token])


  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8000/api/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });

      logout();
      navigate("/authentification"); 
    } catch (err) {
      console.error("Erreur logout :", err);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <nav className={`bg-green-600 text-white p-4 flex flex-col duration-300 ${open ? 'w-60' : 'w-16'}`}>
        <div className="flex h-screen items-center justify-between mb-6">
          <MdMenuOpen size={28} className={`cursor-pointer transition-transform ${!open && 'rotate-180'}`} onClick={() => setOpen(!open)}/>
        </div>

        <ul className="flex-1">
          {menuItems.map((item, index) => (
            <li key={index}  className='hover:bg-blue rounded-md duration-300 cursor-pointer flex gap-2 items-center relative group'>
              <Link
                to={item.path || '#'}
                className={`flex items-center gap-1 px-3 py-2 my-2 rounded-md duration-200 hover:bg-blue-800 group relative ${
                  location.pathname === item.path ? 'bg-blue-800' : ''}`}>
                {item.icon}
                <span className={`transition-all ${!open && 'hidden'}`}>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <button onClick={() => {setSearchOpen(!searchOpen); setTimeout(() => inputRef.current?.focus(), 0);}}><CiSearch /></button>
          <form className="w-full">
            <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher un produit, une catégorie…"
              className={`block w-80 rounded-full border border-gray-300 bg-gray-50 pl-9 pr-10 py-2 outline-none transition-all duration-300 text-sm
                focus:ring-2 focus:ring-blue-200 focus:border-blue-400
                ${searchOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}/>
          </form>

            <div className="flex items-center gap-4">
            <div className="relative">
              <button onClick={() => setNotifOpen(!notifOpen)} className="relative">
                <MdNotificationsNone size={26} className="text-gray-700" />
                {alertes.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                    {alertes.length}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg max-h-80 overflow-y-auto z-50">
                  <h3 className="px-4 py-2 font-semibold text-gray-700 border-b">Alertes stock</h3>
                  {alertes.length === 0 ? (
                    <p className="p-4 text-sm text-gray-500">Aucune alerte</p>
                  ) : (
                    alertes.map((a, i) => (
                      <div key={i} className="px-4 py-2 text-sm text-gray-600 border-b">
                        ⚠️ {a.nom} (Stock: {a.niveau_en_stock})
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

          <div className="relative">
          <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600" type="button">
             <span className="text-gray-600 text-sm hidden sm:block">Bienvenue</span>
            <FaUserCircle size={25} className="text-blue-600" />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-4 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700 dark:divide-gray-600">
                <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                  <div>{user.name}</div>
                  <div className="font-medium truncate">{user.email}</div>
                </div>
                  <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                    <li>
                      <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                        Paramètres
                      </a>
                    </li>
                  </ul>
                  <div className="py-2">
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                      Se deconnecter
                    </button>
              </div>
            </div>
        )}
        </div>
        </div>
        </header>

        <main className="flex-1 bg-gray-100 overflow-y-auto">
          <Outlet context={{ q }} />
        </main>
      </div>
    </div>
  )
}
