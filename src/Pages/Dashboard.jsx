import React, { useEffect, useState } from "react";
import {BarChart,Bar,LineChart,Line,XAxis,YAxis,Tooltip,CartesianGrid,ResponsiveContainer, PieChart, Pie, Cell,} from "recharts";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Erreur API Dashboard");

        const result = await res.json();
        setData(result);
      } catch (error) {
        console.error("Erreur lors du chargement du dashboard :", error);
      }
    };

    fetchData();
  }, [token]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">⏳ Chargement du tableau de bord...</p>
      </div>
    );
  }

  const ventesSemaine = data.ventes_semaine.map((item) => ({
    date: new Date(item.date).toLocaleDateString("fr-FR", {
      weekday: "short",
    }),
    total: item.total,
  }));

  const topProduits = (data.topProduits || []).map(p => ({
  ...p,
  quantite: Number(p.quantite),
}));

  console.log("Top Produits:", topProduits);

  const COLORS = ["#4F46E5", "#22C55E", "#F97316"];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Tableau de bord - Pharmacie
        </h1>
        <p className="text-gray-600">
          Vue d’ensemble des ventes, stocks et alertes
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-gray-500 text-sm">Ventes du jour</h2>
          <p className="text-2xl font-bold text-gray-800">
            {data.ventes_du_jour}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-gray-500 text-sm">Revenus</h2>
          <p className="text-2xl font-bold text-green-600">
            {new Intl.NumberFormat("fr-FR", {
              style: "currency",
              currency: "XOF",
            }).format(data.revenus)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-gray-500 text-sm">Produits en stock</h2>
          <p className="text-2xl font-bold text-gray-800">{data.stock}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-gray-500 text-sm">Alertes</h2>
          <p className="text-2xl font-bold text-red-600">
            {data.alertes.length}
          </p>
        </div>
       <div className="bg-white p-6 rounded-2xl shadow ">
          <h2 className="text-gray-500 text-sm mb-4">
             Produits les plus vendus
          </h2>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={topProduits} dataKey="quantite" nameKey="nom" outerRadius={80} label>
                  {topProduits.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-bold text-gray-700 mb-4">
            Ventes cette semaine
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ventesSemaine}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#4F46E5" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
  <h2 className="text-lg font-bold text-gray-700 mb-4">
    Transactions Récentes
  </h2>
  {data.transactionsRecentes.length === 0 ? (
    <p className="text-gray-500">Aucune transaction récente</p>
  ) : (
    <ul className="space-y-3">
      {data.transactionsRecentes.map((vente) => (
        <li key={vente.id} className="text-sm border-b pb-2">
          <div className="flex justify-between">
            <span className="font-semibold">{vente.user}</span>
            <span className="text-gray-500">{vente.date}</span>
          </div>
          <div className="text-gray-700">
            Produits :{" "}
            {vente.produits.map((p) => `${p.nom} (x${p.quantite})`).join(", ")}
          </div>
          <div className="text-green-600 font-bold">
            Total : {new Intl.NumberFormat("fr-FR", {
              style: "currency",
              currency: "XOF",
            }).format(vente.total)}
          </div>
        </li>
      ))}
    </ul>
  )}
</div>

      </div>
    </div>
  );
}
