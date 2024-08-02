import './index.css'
import Menu from "./pages/Menu";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Order from "./pages/Order";
import EtaScreen from "./pages/EtaScreen";
import Receipt from "./pages/Receipt";
import {Provider} from 'react-redux';
import {store} from './app/store'


function App() {

  return (
    <>
    <Provider store={store}>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Menu/>}/>
      <Route path="order" element={<Order/>}/>
      <Route path="eta" element={<EtaScreen/>}/>
      <Route path="receipt" element={<Receipt/>}/>
    </Routes>
    </BrowserRouter>
    </Provider>
    </>
  )
}

export default App
