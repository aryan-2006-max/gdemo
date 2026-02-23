import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

export default function BarcodeScanner({ onScan }) {
  const scannerRef = useRef(null);
  const html5QrRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    return () => {
      if (html5QrRef.current) {
        html5QrRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const startScanning = async () => {
    setError('');
    try {
      const html5Qr = new Html5Qrcode('barcode-reader');
      html5QrRef.current = html5Qr;

      await html5Qr.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 150 },
        },
        (decodedText) => {
          onScan(decodedText);
          // Brief pause to avoid rapid duplicate scans
          html5Qr.pause();
          setTimeout(() => {
            try {
              html5Qr.resume();
            } catch {
              // scanner may have been stopped
            }
          }, 2000);
        },
        () => {} // ignore scan failures
      );
      setIsScanning(true);
    } catch (err) {
      setError(
        'Camera access denied or not available. Use manual entry below.'
      );
    }
  };

  const stopScanning = async () => {
    if (html5QrRef.current) {
      await html5QrRef.current.stop().catch(() => {});
      html5QrRef.current = null;
    }
    setIsScanning(false);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualCode.trim()) {
      onScan(manualCode.trim());
      setManualCode('');
    }
  };

  return (
    <div className="scanner-container">
      <div className="scanner-camera">
        <div id="barcode-reader" ref={scannerRef}></div>
        {!isScanning && (
          <button className="btn btn-primary scan-start-btn" onClick={startScanning}>
            📷 Start Camera Scanner
          </button>
        )}
        {isScanning && (
          <button className="btn btn-secondary" onClick={stopScanning}>
            ⏹ Stop Scanner
          </button>
        )}
        {error && <p className="error-text">{error}</p>}
      </div>

      <div className="manual-entry">
        <p className="divider-text">── or enter barcode manually ──</p>
        <form onSubmit={handleManualSubmit} className="manual-form">
          <input
            type="text"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            placeholder="Enter barcode number..."
            className="input-field"
          />
          <button type="submit" className="btn btn-primary">
            Add
          </button>
        </form>
      </div>
    </div>
  );
}
