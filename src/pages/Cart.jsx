import { useNavigate } from 'react-router-dom';
import { useApp, getCartTotals } from '../context/AppContext';
import CartItem from '../components/CartItem';

export default function Cart() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const totals = getCartTotals(state.cart, state.appliedOffer);

  if (!state.selectedStore) {
    navigate('/stores');
    return null;
  }

  return (
    <div className="page cart-page">
      <div className="store-banner">
        <span>{state.selectedStore.logo}</span>
        <span>{state.selectedStore.name}</span>
      </div>

      {state.cart.length === 0 ? (
        <div className="empty-cart">
          <p className="empty-icon">🛒</p>
          <h3>Your cart is empty</h3>
          <p>Scan some products to get started</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/scan')}
          >
            ← Back to Scanner
          </button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {state.cart.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal ({totals.itemCount} items)</span>
              <span>₹{totals.subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>GST (Total)</span>
              <span>₹{totals.totalGST.toFixed(2)}</span>
            </div>
            {totals.discount > 0 && (
              <div className="summary-row discount-row">
                <span>Discount ({state.appliedOffer?.code})</span>
                <span>-₹{totals.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="summary-row total-row">
              <strong>Total</strong>
              <strong>₹{totals.total.toFixed(2)}</strong>
            </div>
          </div>

          <div className="cart-actions">
            <button
              className="btn btn-secondary"
              onClick={() => navigate('/scan')}
            >
              ← Scan More
            </button>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => navigate('/payment')}
            >
              Proceed to Pay →
            </button>
          </div>

          <button
            className="btn btn-danger clear-btn"
            onClick={() => dispatch({ type: 'CLEAR_CART' })}
          >
            Clear Cart
          </button>
        </>
      )}
    </div>
  );
}
