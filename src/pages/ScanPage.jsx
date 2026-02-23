import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getProductByBarcode } from '../data/products';
import BarcodeScanner from '../components/BarcodeScanner';
import ProductCard from '../components/ProductCard';

export default function ScanPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [lastScanned, setLastScanned] = useState(null);
  const [scanMessage, setScanMessage] = useState('');

  if (!state.selectedStore) {
    navigate('/stores');
    return null;
  }

  const handleScan = (barcode) => {
    const product = getProductByBarcode(barcode);
    if (product) {
      setLastScanned(product);
      setScanMessage(`✅ Found: ${product.name}`);
    } else {
      setLastScanned(null);
      setScanMessage(`❌ Product not found for barcode: ${barcode}`);
    }
  };

  const handleAddToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
    setScanMessage(`🛒 Added ${product.name} to cart!`);
    setLastScanned(null);
  };

  return (
    <div className="page scan-page">
      <div className="store-banner">
        <span>{state.selectedStore.logo}</span>
        <span>{state.selectedStore.name}</span>
      </div>

      <BarcodeScanner onScan={handleScan} />

      {scanMessage && (
        <div className={`scan-message ${scanMessage.startsWith('❌') ? 'error' : 'success'}`}>
          {scanMessage}
        </div>
      )}

      {lastScanned && (
        <ProductCard product={lastScanned} onAdd={handleAddToCart} />
      )}

      {state.cart.length > 0 && (
        <div className="scan-cart-summary">
          <p>🛒 {state.cart.reduce((s, i) => s + i.quantity, 0)} items in cart</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/cart')}
          >
            View Cart →
          </button>
        </div>
      )}

      <div className="demo-barcodes">
        <h4>Demo Barcodes (for testing)</h4>
        <div className="barcode-list">
          <code>8901030865640</code> — Colgate Toothpaste<br/>
          <code>8901058847154</code> — Maggi Noodles<br/>
          <code>8901262150309</code> — Dairy Milk Silk<br/>
          <code>8901499006400</code> — Parle-G Gold<br/>
          <code>8906002480654</code> — Surf Excel<br/>
          <code>8901057535007</code> — Lays Chips<br/>
          <code>8901023021039</code> — Dettol Handwash<br/>
          <code>8901725181000</code> — Amul Milk<br/>
          <code>8901063251106</code> — Coca-Cola<br/>
          <code>8901088713619</code> — Tata Tea Gold
        </div>
      </div>
    </div>
  );
}
