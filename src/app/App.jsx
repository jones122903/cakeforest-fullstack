import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/home.jsx";
import Topbar from "../components/topbar/topbar.jsx"
import { AppProvider } from "../admin/context/AppContext.jsx";
import AdminLayout from "../admin/components/AdminLayout/AdminLayout.jsx";
import Dashboard from "../admin/pages/Dashboard/Dashboard.jsx";
import ProductList from "../admin/pages/Products/ProductList.jsx";
import AddProduct from "../admin/pages/Products/AddProduct.jsx";
import Orders from "../admin/pages/Orders/Orders.jsx";
import Customers from "../admin/pages/Customers/Customers.jsx";
import Expenses from "../admin/pages/Expenses/Expenses.jsx";
import Coupons from "../admin/pages/Coupons/Coupons.jsx";
import Reports from "../admin/pages/Reports/Reports.jsx";
import Settings from "../admin/pages/Settings/Settings.jsx";
import "./App.css";
import CartUI from "../components/Cart All Pages/CartUI.jsx";
import OrderSummary from "../components/Cart All Pages/CartUI.jsx";
import Buypage from "../pages/buypage.jsx";
import Footer from "../components/footer/footer.jsx";
import PWAInstallPrompt from "../components/PWAInstallPrompt/PWAInstallPrompt.jsx";

import "bootstrap/dist/css/bootstrap.min.css"


import { AuthProvider } from "../admin/context/AuthContext.jsx";
import Login from "../components/login/login.jsx";

// import CakeGallery from "../components/cake_gallery/CakeGallery.jsx";
 
        {/* <Route path="/cake_category" element={<CakeCategory/>} />

 





      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/topbar" element={<Topbar />} />
        <Route path="/footer" element={<Footer />} />
        <Route path="/cart" element={<OrderSummary/>} />
        {/* <Route path="/blog" element={<BlogSection/>} /> */}
        {/* <Route path="/category" element={<Category />} />
        <Route path="/cake_category" element={<CakeCategory/>} />

        <Route path="/carousel" element={<Carousel/>} />
        <Route path="/cake_flovor" element={<Cakeflovour/>} /> */}
  
function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <PWAInstallPrompt />

          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/buypage" element={<Buypage />} />
            <Route path="/footer" element={<Footer />} />
            <Route path="/login" element={<Login />} />


            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<ProductList />} />
              <Route path="products/add" element={<AddProduct />} />
              <Route path="products/edit/:id" element={<AddProduct />} />
              <Route path="orders" element={<Orders />} />
              <Route path="customers" element={<Customers />} />
              <Route path="expenses" element={<Expenses />} />
              <Route path="coupons" element={<Coupons />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;