import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Poll } from '../types';
import { generateTotpPublic } from '../utils/totp';

interface QRDisplayProps {
  poll: Poll;
  onBack: () => void;
}

export function QRDisplay({ poll, onBack }: QRDisplayProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [currentToken, setCurrentToken] = useState<string>('');
  const [timeRemaining, setTimeRemaining] = useState<number>(10);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1); // 1 = 100%, 0.5 = 50%, 2 = 200%, etc.

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev);
  };

  const zoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 3)); // Max 300%
  };

  const zoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.5)); // Min 50%
  };

  const resetZoom = () => {
    setZoomLevel(1);
  };

  const generateQR = async () => {
    try {
      const token = generateTotpPublic(poll.secretKey, 10);
      setCurrentToken(token);

      const url = `https://www.porgunc.com/form/${poll.pollId}?token=${token}`;

      const qrDataUrl = await QRCode.toDataURL(url, {
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });

      setQrCodeUrl(qrDataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  useEffect(() => {
    generateQR();

    const interval = setInterval(() => {
      generateQR();
      setTimeRemaining(10);
    }, 10000);

    // Set up countdown timer
    const countdownInterval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Space' || event.key === ' ') {
        event.preventDefault();
        toggleVisibility();
        return;
      }


      if ((event.ctrlKey || event.metaKey) && (event.key === '+' || event.key === '=')) {
        event.preventDefault();
        zoomIn();
        return;
      }

      if ((event.ctrlKey || event.metaKey) && event.key === '-') {
        event.preventDefault();
        zoomOut();
        return;
      }

      if ((event.ctrlKey || event.metaKey) && event.key === '0') {
        event.preventDefault();
        resetZoom();
        return;
      }

      if (event.key === '+' || event.key === '=') {
        event.preventDefault();
        zoomIn();
        return;
      }

      if (event.key === '-') {
        event.preventDefault();
        zoomOut();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      clearInterval(interval);
      clearInterval(countdownInterval);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [poll]);

  return (
    <div className="qr-display-container">
      <div className="qr-header">
        <button onClick={onBack} className="back-button">
          ← Back
        </button>
        <h2>{poll.name}</h2>
      </div>

      <div className="qr-content">
        {qrCodeUrl ? (
          <div className="qr-wrapper">
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '400px',
              width: '100%'
            }}>
              <img
                src={qrCodeUrl}
                alt="QR Code"
                className="qr-code"
                onClick={toggleVisibility}
                style={{
                  cursor: 'pointer',
                  display: isVisible ? 'block' : 'none',
                  width: `${400 * zoomLevel}px`,
                  height: `${400 * zoomLevel}px`,
                  transition: 'width 0.2s ease, height 0.2s ease'
                }}
              />
              {!isVisible && (
                <div
                  className="qr-hidden-placeholder"
                  onClick={toggleVisibility}
                  style={{
                    cursor: 'pointer',
                    width: '400px',
                    height: '400px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f0f0f0',
                    border: '2px dashed #ccc',
                    borderRadius: '8px'
                  }}
                >
                  <p style={{ color: '#666', fontSize: '16px' }}>Click or press Space to show QR code</p>
                </div>
              )}
            </div>
            <div className="zoom-controls" style={{
              display: 'flex',
              gap: '10px',
              justifyContent: 'center',
              alignItems: 'center',
              margin: '15px 0',
              padding: '10px',
              backgroundColor: '#f5f5f5',
              borderRadius: '8px'
            }}>
              <button
                onClick={zoomOut}
                className="zoom-button"
                style={{
                  padding: '8px 16px',
                  fontSize: '18px',
                  cursor: 'pointer',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  backgroundColor: 'white',
                  color: '#333'
                }}
                title="Zoom out (- key)"
              >
                −
              </button>
              <span style={{
                minWidth: '80px',
                textAlign: 'center',
                fontSize: '14px',
                fontWeight: '500',
                color: '#333'
              }}>
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={zoomIn}
                className="zoom-button"
                style={{
                  padding: '8px 16px',
                  fontSize: '18px',
                  cursor: 'pointer',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  backgroundColor: 'white',
                  color: '#333'
                }}
                title="Zoom in (+ key)"
              >
                +
              </button>
              <button
                onClick={resetZoom}
                className="zoom-button"
                style={{
                  padding: '8px 16px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  backgroundColor: 'white',
                  color: '#333'
                }}
                title="Reset zoom (Ctrl/Cmd+0)"
              >
                Reset
              </button>
            </div>
            <div className="qr-info">
              <p className="token-display">
                Token: {isVisible ? currentToken : '••••••••••'}
              </p>
              <p className="timer">Refreshing in {timeRemaining}s</p>
              <p className="poll-id">Poll ID: {poll.pollId}</p>
            </div>
          </div>
        ) : (
          <p>Generating QR code...</p>
        )}
      </div>
    </div>
  );
}
