import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/global.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Installable app: register the offline service worker on real HTTPS deployments only
// (skipped on localhost dev and inside sandboxed previews where it is not allowed).
if ('serviceWorker' in navigator && location.protocol === 'https:' && window.self === window.top) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => undefined);
  });
}
