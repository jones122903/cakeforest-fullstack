import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/home.jsx";
import { Toaster } from "react-hot-toast";
import Topbar from "../components/topbar/topbar.jsx";
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
import PrizePoolList from "../admin/pages/PrizePool/PrizePoolList.jsx";
import PrizePoolStats from "../admin/pages/PrizePool/PrizePoolStats.jsx";
import CreatePrizePool from "../admin/pages/PrizePool/CreatePrizePool.jsx";
import "./App.css";
import CartUI from "../components/Cart All Pages/CartUI.jsx";
import OrderSummary from "../components/Cart All Pages/CartUI.jsx";
import Buypage from "../pages/buypage.jsx";
import Footer from "../components/footer/footer.jsx";
import CakeGallery from "../components/cake_gallery/cakeGallery.jsx";
import PWAInstallPrompt from "../components/PWAInstallPrompt/PWAInstallPrompt.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from "../admin/context/AuthContext.jsx";
import Login from "../components/login/login.jsx";
import NewForget from "../components/login/forget/NewForget.jsx";
import Otp from "../components/login/OtpPage/Otp.jsx";
import NewReset from "../components/login/ComfirmPage/NewReset.jsx";
import CustomerDetails from "../components/customer/customerDetails.jsx";
import Wishlist from "../components/wishlist/Wishlist.jsx";
import CouponsPage from "../pages/CouponsPage.jsx";
import ReviewsPage from "../components/Review_page/ReviewsPage.jsx";
import RewardsPage from "../pages/RewardsPage.jsx";
import ContactPage from "../pages/ContactPage.jsx";





// import CakeGallery from "../components/cake_gallery/CakeGallery.jsx";

{/* <Route path="/cake_category" element={<CakeCategory/>} />
// import CakeGallery from "../components/cake_gallery/CakeGallery.jsx";

{
  /* <Route path="/cake_category" element={<CakeCategory/>} />

 





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
    <>
      <Toaster containerStyle={{ zIndex: 99999999 }} position="top-center" />
      <AuthProvider>
        <AppProvider>
          <Router>
            <PWAInstallPrompt />

            <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/buypage/:id" element={<Buypage />} />
            <Route path="/order" element={<OrderSummary />} />
            <Route path="/details" element={<CustomerDetails />} />
            <Route path="/gallery" element={<CakeGallery />} />
            <Route path="/footer" element={<Footer />} />
            <Route path="/login" element={<Login />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/forget" element={<NewForget />} />
            <Route path="/otp" element={<Otp />} />
            <Route path="/comfirm" element={<NewReset />} />
            <Route path="/couponspage" element={<CouponsPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />

            <Route path="/rewards" element={<RewardsPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              {/* <Route path="dashboard" element={<Dashboard />} /> */}
              <Route path="products" element={<ProductList />} />
              <Route path="products/add" element={<AddProduct />} />
              <Route path="products/edit/:id" element={<AddProduct />} />
              <Route path="orders" element={<Orders />} />
              <Route path="customers" element={<Customers />} />
              <Route path="expenses" element={<Expenses />} />
              <Route path="coupons" element={<Coupons />} />
              <Route path="prize-pools" element={<PrizePoolList />} />
              <Route path="prize-pools/create" element={<CreatePrizePool />} />
              <Route path="prize-pools/:id/stats" element={<PrizePoolStats />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </Router>
      </AppProvider>
    </AuthProvider>
    </>
  );
}

export default App;
