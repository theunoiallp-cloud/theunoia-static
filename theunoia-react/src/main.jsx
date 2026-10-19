import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './content/nav.css';   // the shared header (every class starts with "tn-")

createRoot(document.getElementById('root')).render(<App />);
