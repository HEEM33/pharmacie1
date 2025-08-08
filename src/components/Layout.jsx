import React, { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'

import { MdMenuOpen } from "react-icons/md"
import { IoHomeOutline } from "react-icons/io5"
import { FaCashRegister, FaHandHoldingMedical, FaProductHunt, FaUserCircle } from "react-icons/fa"
import { TbCategoryPlus, TbReportSearch } from "react-icons/tb"
import { IoLogoBuffer } from "react-icons/io"
import { CiSearch, CiSettings } from "react-icons/ci"
import { MdOutlineDashboard } from "react-icons/md"

const menuItems = [
  { icon: <IoHomeOutline size={24} />, label: 'Home', path: '/' },
  { icon: <MdOutlineDashboard size={24} />, label: 'Dashboard' },
  { icon: <CiSettings size={24} />, label: 'Setting' },
  { icon: <IoLogoBuffer size={24} />, label: 'Log' },
  { icon: <FaCashRegister size={24} />, label: 'Paiement', path: 'paiement' },
  { icon: <FaHandHoldingMedical size={24} />, label: 'Pharmacie', path: 'pharmacie' },
  { icon: <FaProductHunt size={24} />, label: 'Produits', path: 'produits'  },
  { icon: <TbCategoryPlus size={24} />, label: 'Categories', path: 'categories'  },
]

export default function Layout() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="flex h-screen overflow-hidden">
      <nav className={`bg-blue-600 text-white p-4 flex flex-col duration-300 ${open ? 'w-60' : 'w-16'}`}>
        <div className="flex items-center justify-between mb-6">
          <MdMenuOpen
            size={28}
            className={`cursor-pointer transition-transform ${!open && 'rotate-180'}`}
            onClick={() => setOpen(!open)}
          />
        </div>

        <ul className="flex-1">
          {menuItems.map((item, index) => (
            <li key={index}  className='hover:bg-blue-800 rounded-md duration-300 cursor-pointer flex gap-2 items-center relative group'>
              <Link
                to={item.path || '#'}
                className={`flex items-center gap-2 px-3 py-2 my-2 rounded-md duration-200 hover:bg-blue-800 group relative ${
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
          <CiSearch />
          <div className="flex items-center gap-4">
            <span className="text-gray-600 text-sm hidden sm:block">Bienvenue, Emile</span>
            <FaUserCircle size={28} className="text-blue-600" />
          </div>
        </header>

        <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
