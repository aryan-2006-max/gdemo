import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="page home-page">
      <div className="home-hero">
        <div className="home-icon">🛒</div>
        <h2>Smart Self-Checkout</h2>
        <p className="home-tagline">
          Skip the queue. Scan, Pay & Go!
        </p>
      </div>

      <div className="home-features">
        <div className="feature">
          <span className="feature-icon">📱</span>
          <h4>Scan Barcode</h4>
          <p>Use your phone camera to scan product barcodes</p>
        </div>
        <div className="feature">
          <span className="feature-icon">🧾</span>
          <h4>Auto Billing</h4>
          <p>GST calculated automatically for each item</p>
        </div>
        <div className="feature">
          <span className="feature-icon">💳</span>
          <h4>Pay Digitally</h4>
          <p>UPI, Card, or Wallet — your choice</p>
        </div>
        <div className="feature">
          <span className="feature-icon">✅</span>
          <h4>Show & Go</h4>
          <p>Show digital bill at the exit and leave</p>
        </div>
      </div>

      <button
        className="btn btn-primary btn-lg home-cta"
        onClick={() => navigate('/stores')}
      >
        Start Shopping →
      </button>
    </div>
  );
}
