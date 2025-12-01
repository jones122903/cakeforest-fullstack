import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "../pages/home.jsx";
import Topbar from "../components/topbar/topbar.jsx"
import Footer from "../components/footer/footer.jsx"
import Category from "../components/categories/category.jsx"
import "./App.css";
import Carousel from "../components/carousel/carousel.jsx";
import CakeCategory from "../components/Cake_Choices/Cake_Choices.jsx";
import Cakeflovour from "../components/cakeFlovour/cakeflovour.jsx";
import PWAInstallPrompt from "../components/PWAInstallPrompt/PWAInstallPrompt.jsx";
import CakeGallery from "../components/cake_gallery/CakeGallery.jsx";

function App() {
  return (
    <Router>
      <PWAInstallPrompt />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/topbar" element={<Topbar />} />
        <Route path="/footer" element={<Footer />} />
        <Route path="/gallery" element={<CakeGallery />} />
        {/* <Route path="/cake_category" element={<CakeCategory/>} />

        <Route path="/carousel" element={<Carousel/>} />
        <Route path="/cake_flovor" element={<Cakeflovour/>} /> */}
      </Routes>
    </Router>
  );
}

export default App;