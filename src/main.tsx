import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log('🚨 MAIN.TSX YÜKLENDİ!');
console.log('Root element:', document.getElementById('root'));

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element bulunamadı!');
  }
  
  console.log('🚨 REACT RENDER BAŞLIYOR!');
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  console.log('🚨 REACT RENDER TAMAMLANDI!');
} catch (error) {
  console.error('🚨 REACT RENDER HATASI:', error);
  document.getElementById('root')!.innerHTML = `
    <div style="padding: 20px; background: red; color: white; font-size: 18px;">
      <h1>REACT RENDER HATASI!</h1>
      <p>Hata: ${error}</p>
    </div>
  `;
}