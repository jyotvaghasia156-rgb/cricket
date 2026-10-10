import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Chase Master Crash Caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          width: '100vw',
          height: '100vh',
          backgroundColor: '#040814',
          color: '#F8FAFC',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: 'Inter, sans-serif',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '14px',
            fontWeight: 800,
            color: '#F59E0B',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginBottom: '8px'
          }}>
            CHASE MASTER: KING KOHLI 18
          </div>
          <h2 style={{
            fontSize: '28px',
            fontWeight: 800,
            color: '#FFFFFF',
            marginBottom: '16px'
          }}>
            Game Arena Recovered
          </h2>
          <p style={{
            color: '#94A3B8',
            maxWidth: '520px',
            fontSize: '15px',
            lineHeight: 1.6,
            marginBottom: '24px'
          }}>
            The game encountered a graphics or initialization interruption. Click below to reload the arena with fresh assets.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: 'linear-gradient(135deg, #0284C7 0%, #2563EB 100%)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 32px',
              fontSize: '15px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)'
            }}
          >
            RELOAD ARENA
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

