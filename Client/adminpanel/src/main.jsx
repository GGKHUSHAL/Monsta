import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import MainContext from './Pages/MainContext'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <MainContext>
   <App />
   </MainContext>
</BrowserRouter>
,
)
