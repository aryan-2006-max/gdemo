import { useNavigate, useLocation } from 'react-router-dom';
import { useApp, getCartTotals } from '../context/AppContext';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useApp();
  const { itemCount } = getCartTotals(state.cart, state.appliedOffer);

  const isHome = location.pathname === '/';

  const titles = {
    '/': 'Smart Checkout',
    '/stores': 'Select Store',
    '/scan': 'Scan Products',
    '/cart': 'My Cart',
    '/payment': 'Payment',
    '/receipt': 'Digital Receipt',
  };

  const title = titles[location.pathname] || 'Smart Checkout';

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {!isHome && (
          <button className="nav-btn back-btn" onClick={() => navigate(-1)}>
            ← Back
          </button>
        )}
      </div>
      <h1 className="navbar-title">{title}</h1>
      <div className="navbar-right">
        {state.selectedStore && location.pathname !== '/receipt' && (
          <button
            className="nav-btn cart-btn"
            onClick={() => navigate('/cart')}
          >
            🛒
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </button>
        )}
      </div>
    </nav>
  );
}
