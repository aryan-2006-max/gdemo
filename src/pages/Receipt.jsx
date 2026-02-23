import { useNavigate } from 'react-router-dom';
import { useApp, exportBackup } from '../context/AppContext';

export default function Receipt() {
  const navigate = useNavigate();
  const { state } = useApp();

  const txn = state.transactions[state.transactions.length - 1];

  if (!txn) {
    navigate('/');
    return null;
  }

  const paymentLabels = {
    upi: '📱 UPI',
    card: '💳 Card',
    wallet: '👛 Wallet',
  };

  return (
    <div className="page receipt-page">
      <div className="receipt-card">
        <div className="receipt-header">
          <div className="receipt-check">✅</div>
          <h2>Payment Successful!</h2>
          <p className="receipt-txn">Transaction ID: {txn.id}</p>
        </div>

        <div className="receipt-store">
          <span>{txn.store.logo}</span>
          <span>{txn.store.name}</span>
        </div>

        <div className="receipt-date">
          {new Date(txn.timestamp).toLocaleString('en-IN', {
            dateStyle: 'full',
            timeStyle: 'short',
          })}
        </div>

        <div className="receipt-items">
          <h4>Items Purchased</h4>
          {txn.items.map((item, idx) => (
            <div key={idx} className="receipt-item">
              <div className="receipt-item-name">
                {item.name} × {item.quantity}
              </div>
              <div className="receipt-item-price">
                ₹{(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div className="receipt-totals">
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{txn.subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>GST</span>
            <span>₹{txn.gst.toFixed(2)}</span>
          </div>
          {txn.discount > 0 && (
            <div className="summary-row discount-row">
              <span>Discount ({txn.appliedOffer?.code})</span>
              <span>-₹{txn.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="summary-row total-row">
            <strong>Total Paid</strong>
            <strong>₹{txn.total.toFixed(2)}</strong>
          </div>
          <div className="summary-row">
            <span>Payment Method</span>
            <span>{paymentLabels[txn.paymentMethod] || txn.paymentMethod}</span>
          </div>
        </div>

        <div className="receipt-barcode-visual">
          <div className="barcode-lines">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="barcode-line"
                style={{ width: Math.random() > 0.5 ? 3 : 1 }}
              />
            ))}
          </div>
          <p className="barcode-text">{txn.id}</p>
        </div>

        <p className="receipt-footer">
          Show this digital bill at the store exit
        </p>
      </div>

      <div className="receipt-actions">
        <button
          className="btn btn-secondary"
          onClick={() => exportBackup(state.transactions)}
        >
          📥 Download Backup
        </button>
        <button
          className="btn btn-primary btn-lg"
          onClick={() => navigate('/')}
        >
          🏠 Back to Home
        </button>
      </div>
    </div>
  );
}
