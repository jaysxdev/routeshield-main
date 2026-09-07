import React from 'react';
import ReactDOM from 'react-dom/client';
import './i18n';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <React.Suspense
        fallback={
          <div className="min-h-screen bg-[#071A2B] text-cyanGlow-400 flex items-center justify-center font-sans">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-cyanGlow-400 animate-ping" />
              <span className="font-semibold text-sm tracking-wide">Loading RouteShield Pune...</span>
            </div>
          </div>
        }
      >
        <App />
      </React.Suspense>
    </React.StrictMode>
  );
}

