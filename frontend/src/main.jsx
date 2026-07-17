import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./assets/styles/global.css";
import "./assets/styles/variables.css";
import "./assets/styles/responsive.css";
import App from './App.jsx'



createRoot(document.getElementById('root')).render(
<>
<App />
</>
    

)
