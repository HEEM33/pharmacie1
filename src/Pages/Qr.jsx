import { Scanner } from "@yudiel/react-qr-scanner";
import { useState, useEffect } from "react";
import Stock from "./Stock";

export default function QRCodeScanner({ onScan, produits }) {
  const [scannedData, setScannedData] = useState("");
  const [selectedProduit, setSelectedProduit] = useState("");
  const [quantite, setQuantite] = useState("");
  const [commandes, setCommandes] = useState([]);

  useEffect(() => {
    if (scannedData && produits) {
      const produitTrouve = produits.find(
        (p) => p.qrCode === scannedData || p.id.toString() === scannedData);
      if (produitTrouve) {
        setSelectedProduit(produitTrouve.id);
        setQuantite((prev) => parseInt(prev || 0) + 1); 
      }
    }
    
  }, [scannedData, produits, setSelectedProduit, setQuantite]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-xl font-semibold mb-4">Scanner un produit</h2>

      <div className="w-64 h-64 border-2 border-gray-300 rounded-lg overflow-hidden shadow-md">
        <Scanner
          onDecode={(result) => {
            setScannedData(result);  
            if (onScan) onScan(result);
          }}
          onError={(error) => console.error(error)}
          constraints={{ facingMode: "environment" }}
        />
      </div>

      <p className="mt-4 text-gray-700">Résultat : {scannedData}</p>
      <Stock
      selectedProduit={selectedProduit}
        setSelectedProduit={setSelectedProduit}
        quantite={quantite}
        setQuantite={setQuantite}
        commandes={commandes}
        setCommandes={setCommandes} />
    </div>
  );
}
