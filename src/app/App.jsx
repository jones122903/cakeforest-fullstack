import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "../pages/home.jsx";
import Topbar from "../components/topbar/topbar.jsx"
import Footer from "../components/footer/footer.jsx"

import "./App.css";

import PWAInstallPrompt from "../components/PWAInstallPrompt/PWAInstallPrompt.jsx";

// import CartUI from "../components/Cart All Pages/CartUI.jsx";
import OrderSummary from "../components/Cart All Pages/CartUI.jsx";

function App() {
  return (
    <Router>
      <PWAInstallPrompt />



      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/topbar" element={<Topbar />} />
        <Route path="/footer" element={<Footer />} />
        <Route path="/cart" element={<OrderSummary/>} />
        {/* <Route path="/blog" element={<BlogSection/>} /> */}
        {/* <Route path="/category" element={<Category />} />
        <Route path="/cake_category" element={<CakeCategory/>} />

        <Route path="/carousel" element={<Carousel/>} />
        <Route path="/cake_flovor" element={<Cakeflovour/>} /> */}
      </Routes>
    </Router>
  );
}

export default App;
