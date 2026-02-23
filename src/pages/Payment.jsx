import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, getCartTotals } from '../context/AppContext';
import offers from '../data/offers';
import OfferCard from '../components/OfferCard';

export default function Payment() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [processing, setProcessing] = useState(false);
  const totals = getCartTotals(state.cart, state.appliedOffer);

  if (!state.selectedStore || state.cart.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleApplyOffer = (offer) => {
    dispatch({ type: 'APPLY_OFFER', payload: offer });
  };

  const handleRemoveOffer = () => {
    dispatch({ type: 'REMOVE_OFFER' });
  };

  const handlePay = () => {
    if (!paymentMethod) return;
    setProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      dispatch({
        type: 'COMPLETE_TRANSACTION',
        payload: {
          paymentMethod,
          subtotal: totals.subtotal,
          gst: totals.totalGST,
          discount: totals.discount,
          total: totals.total,
        },
      });
      setProcessing(false);
      navigate('/receipt');
    }, 2000);
  };

  const methods = [
    { id: 'upi', label: 'UPI', icon: '📱', desc: 'Google Pay, PhonePe, Paytm' },
    { id: 'card', label: 'Card', icon: '💳', desc: 'Credit / Debit Card' },
    { id: 'wallet', label: 'Wallet', icon: '👛', desc: 'Paytm, Amazon Pay' },
  ];

  return (
    <div className="page payment-page">
      {/* Order Summary */}
      <div className="payment-summary">
        <h3>Order Total</h3>
        <div className="summary-row">
          <span>Subtotal</span>
          <span>₹{totals.subtotal.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>GST</span>
          <span>₹{totals.totalGST.toFixed(2)}</span>
        </div>
        {totals.discount > 0 && (
          <div className="summary-row discount-row">
            <span>Discount ({state.appliedOffer?.code})</span>
            <span>-₹{totals.discount.toFixed(2)}</span>
          </div>
        )}
        <div className="summary-row total-row">
          <strong>Amount to Pay</strong>
          <strong>₹{totals.total.toFixed(2)}</strong>
        </div>
      </div>

      {/* Offers Section */}
      <div className="offers-section">
        <h3>🎁 Available Offers</h3>
        <div className="offers-list">
          {offers.map((offer) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              subtotal={totals.subtotal}
              isApplied={state.appliedOffer?.id === offer.id}
              onApply={handleApplyOffer}
              onRemove={handleRemoveOffer}
            />
          ))}
        </div>
      </div>

      {/* Payment Method */}
      <div className="payment-methods">
        <h3>💰 Select Payment Method</h3>
        <div className="methods-list">
          {methods.map((m) => (
            <button
              key={m.id}
              className={`method-card ${paymentMethod === m.id ? 'method-selected' : ''}`}
              onClick={() => setPaymentMethod(m.id)}
            >
              <span className="method-icon">{m.icon}</span>
              <div className="method-info">
                <strong>{m.label}</strong>
                <p>{m.desc}</p>
              </div>
              {paymentMethod === m.id && <span className="method-check">✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Pay Button */}
      <button
        className={`btn btn-primary btn-lg pay-btn ${!paymentMethod ? 'btn-disabled' : ''}`}
        onClick={handlePay}
        disabled={!paymentMethod || processing}
      >
        {processing
          ? '⏳ Processing Payment...'
          : `Pay ₹${totals.total.toFixed(2)} →`}
      </button>
    </div>
  );
}
