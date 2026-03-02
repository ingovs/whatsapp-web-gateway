import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { QRCodeSVG } from 'qrcode.react';
import './App.css';

// Connect to the API server
const socket = io('http://localhost:3001');

function App() {
  const [status, setStatus] = useState('CONNECTING...');
  const [qrCode, setQrCode] = useState('');
  // const [pairingCode, setPairingCode] = useState('');
  // const [phoneNumber, setPhoneNumber] = useState('');
  // const [usePairingCode, setUsePairingCode] = useState(false);
  // const [loadingCode, setLoadingCode] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('status', (newStatus) => {
      console.log('Status update:', newStatus);
      setStatus(newStatus);
      if (newStatus === 'READY' || newStatus === 'AUTHENTICATED') {
        setQrCode('');
        // setPairingCode('');
      }
    });

    socket.on('qr', (qr) => {
      console.log('QR Code received');
      setQrCode(qr);
      if (status !== 'READY' && status !== 'AUTHENTICATED') {
        setStatus('SCAN_QR');
      }
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      setStatus('DISCONNECTED');
    });

    return () => {
      socket.off('connect');
      socket.off('status');
      socket.off('qr');
      socket.off('disconnect');
    };
  }, [status]);

  // const handleGetPairingCode = async () => {
  //   if (!phoneNumber) return;
  //   setLoadingCode(true);
  //   try {
  //     const response = await fetch(`http://localhost:3001/auth/pairing_code?phone_number=${phoneNumber}`, {
  //       method: 'GET',
  //       headers: { 'Content-Type': 'application/json' }
  //     });
  //     const data = await response.json();
  //     if (data.success) {
  //       setPairingCode(data.code);
  //     } else {
  //       alert('Error: ' + data.error);
  //     }
  //   } catch (error) {
  //     alert('Failed to get code');
  //   } finally {
  //     setLoadingCode(false);
  //   }
  // };

  const handleLogout = async () => {
    if (!confirm('Are you sure you want to logout? This will clear the session.')) return;
    setLoggingOut(true);
    try {
      const response = await fetch('http://localhost:3001/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (!data.success) {
        alert('Logout error: ' + data.error);
      }
    } catch (error) {
      alert('Failed to logout');
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="container">
      <h1>WhatsApp Gateway</h1>

      <div className={`status-badge status-${status.toLowerCase()}`}>
        Status: {status}
      </div>

      <div className="card">
        {(status === 'SCAN_QR' || status === 'INITIALIZING' || status === 'QR_READY') && (
          <div className="auth-methods-container">
            <div className="qr-section">
              <h3>Scan QR Code</h3>
              <div className="qr-container">
                {qrCode ? (
                  <QRCodeSVG value={qrCode} size={256} />
                ) : (
                  <div style={{ width: 256, height: 256, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f0f0' }}>
                    <p>Waiting for QR...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Pairing code section commented out - using QR Code only
            <div className="divider">OR</div>

            <div className="pairing-section">
              <h3>Link with Phone Number</h3>
              {!pairingCode ? (
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="e.g. 5511999999999"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                  <button onClick={handleGetPairingCode} disabled={loadingCode}>
                    {loadingCode ? "Getting Code..." : "Get Pairing Code"}
                  </button>
                </div>
              ) : (
                <div className="code-display">
                  <p>Enter this code in WhatsApp:</p>
                  <div className="code-box">{pairingCode}</div>
                  <button onClick={() => setPairingCode('')} className="text-btn">Try another number</button>
                </div>
              )}
            </div>
            */}
          </div>
        )}

        {status === 'READY' && (
          <div className="success-message">
            <h2>✅ Client is Ready</h2>
            <p>You can now send messages via the API.</p>
            <button className="logout-btn" onClick={handleLogout} disabled={loggingOut}>
              {loggingOut ? 'Logging out...' : '🚪 Force Logout'}
            </button>
          </div>
        )}
        {status === 'AUTHENTICATED' && (
          <div className="success-message">
            <h2>✅ Client is Authenticated</h2>
            <p>Waiting for readiness...</p>
            <button className="logout-btn" onClick={handleLogout} disabled={loggingOut}>
              {loggingOut ? 'Logging out...' : '🚪 Force Logout'}
            </button>
          </div>
        )}


      </div>
    </div>
  );
}

export default App;
