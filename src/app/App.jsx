// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Home from "../pages/home.jsx";
// import { Toaster } from "react-hot-toast";
// import Topbar from "../components/topbar/topbar.jsx";
// import { AppProvider } from "../admin/context/AppContext.jsx";
// import AdminLayout from "../admin/components/AdminLayout/AdminLayout.jsx";
// import Dashboard from "../admin/pages/Dashboard/Dashboard.jsx";
// import ProductList from "../admin/pages/Products/ProductList.jsx";
// import AddProduct from "../admin/pages/Products/AddProduct.jsx";
// import Orders from "../admin/pages/Orders/Orders.jsx";
// import Customers from "../admin/pages/Customers/Customers.jsx";
// import Expenses from "../admin/pages/Expenses/Expenses.jsx";
// import Coupons from "../admin/pages/Coupons/Coupons.jsx";
// import Reports from "../admin/pages/Reports/Reports.jsx";
// import Settings from "../admin/pages/Settings/Settings.jsx";
// import PrizePoolList from "../admin/pages/PrizePool/PrizePoolList.jsx";
// import PrizePoolStats from "../admin/pages/PrizePool/PrizePoolStats.jsx";
// import CreatePrizePool from "../admin/pages/PrizePool/CreatePrizePool.jsx";
// import Banner from "../admin/pages/banner/banner.jsx";
// import "./App.css";
// import CartUI from "../components/Cart All Pages/CartUI.jsx";
// import OrderSummary from "../components/Cart All Pages/CartUI.jsx";
// import Buypage from "../pages/buypage.jsx";
// import Footer from "../components/footer/footer.jsx";
// import CakeGallery from "../components/cake_gallery/cakeGallery.jsx";
// import PWAInstallPrompt from "../components/PWAInstallPrompt/PWAInstallPrompt.jsx";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { AuthProvider } from "../admin/context/AuthContext.jsx";
// import Login from "../components/login/login.jsx";
// import NewForget from "../components/login/forget/NewForget.jsx";
// import Otp from "../components/login/OtpPage/Otp.jsx";
// import NewReset from "../components/login/ComfirmPage/NewReset.jsx";
// import CustomerDetails from "../components/customer/customerDetails.jsx";
// import Wishlist from "../components/wishlist/Wishlist.jsx";
// import CouponsPage from "../pages/CouponsPage.jsx";
// import ReviewsPage from "../components/Review_page/ReviewsPage.jsx";
// import RewardsPage from "../pages/RewardsPage.jsx";
// import ContactPage from "../pages/ContactPage.jsx";
// import AboutPage from "../pages/AboutPage.jsx";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// function App() {
//   return (
//     <>
//       <AuthProvider>
//         <AppProvider>
//           <Toaster
//             containerStyle={{ zIndex: 99999999, top: 20, right: 20 }}
//             position="top-right"
//           />
//           <Router>
//             <PWAInstallPrompt />

//             <Routes>
//               {/* Public Routes */}
//               <Route path="/" element={<Home />} />
//               <Route path="/buypage/:id" element={<Buypage />} />
//               <Route path="/order" element={<OrderSummary />} />
//               <Route path="/details" element={<CustomerDetails />} />
//               <Route path="/gallery" element={<CakeGallery />} />
//               <Route path="/footer" element={<Footer />} />
//               <Route path="/login" element={<Login />} />
//               <Route path="/wishlist" element={<Wishlist />} />
//               <Route path="/forget" element={<NewForget />} />
//               <Route path="/otp" element={<Otp />} />
//               <Route path="/comfirm" element={<NewReset />} />
//               <Route path="/couponspage" element={<CouponsPage />} />
//               <Route path="/reviews" element={<ReviewsPage />} />

//               <Route path="/rewards" element={<RewardsPage />} />
//               <Route path="/contact" element={<ContactPage />} />
//               <Route path="/about" element={<AboutPage />} />

//               {/* Admin Routes */}
//               <Route path="/admin" element={<AdminLayout />}>
//                 {/* <Route path="dashboard" element={<Dashboard />} /> */}
//                 <Route path="products" element={<ProductList />} />
//                 <Route path="products/add" element={<AddProduct />} />
//                 <Route path="products/edit/:id" element={<AddProduct />} />
//                 <Route path="orders" element={<Orders />} />
//                 <Route path="customers" element={<Customers />} />
//                 <Route path="banners" element={<Banner />} />
//                 <Route path="expenses" element={<Expenses />} />
//                 <Route path="coupons" element={<Coupons />} />
//                 <Route path="prize-pools" element={<PrizePoolList />} />
//                 <Route path="prize-pools/create" element={<CreatePrizePool />} />
//                 <Route path="prize-pools/:id/stats" element={<PrizePoolStats />} />
//                 <Route path="reports" element={<Reports />} />
//                 <Route path="settings" element={<Settings />} />
//               </Route>
//             </Routes>
//           </Router>
//         </AppProvider>
//       </AuthProvider>
//     </>
//   );
// }

// export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Toaster } from "react-hot-toast";
import { AppProvider } from "../admin/context/AppContext.jsx";
import { AuthProvider } from "../admin/context/AuthContext.jsx";
import PWAInstallPrompt from "../components/PWAInstallPrompt/PWAInstallPrompt.jsx";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

 
const Home = lazy(() => import("../pages/home.jsx"));
const Buypage = lazy(() => import("../pages/buypage.jsx"));
const OrderSummary = lazy(
  () => import("../components/Cart All Pages/CartUI.jsx"),
);
const CustomerDetails = lazy(
  () => import("../components/customer/customerDetails.jsx"),
);
const CakeGallery = lazy(
  () => import("../components/cake_gallery/cakeGallery.jsx"),
);
const Footer = lazy(() => import("../components/footer/footer.jsx"));
const Login = lazy(() => import("../components/login/login.jsx"));
const Wishlist = lazy(() => import("../components/wishlist/Wishlist.jsx"));
const NewForget = lazy(
  () => import("../components/login/forget/NewForget.jsx"),
);
const Otp = lazy(() => import("../components/login/OtpPage/Otp.jsx"));
const NewReset = lazy(
  () => import("../components/login/ComfirmPage/NewReset.jsx"),
);
const CouponsPage = lazy(() => import("../pages/CouponsPage.jsx"));
const ReviewsPage = lazy(
  () => import("../components/Review_page/ReviewsPage.jsx"),
);
const RewardsPage = lazy(() => import("../pages/RewardsPage.jsx"));
const ContactPage = lazy(() => import("../pages/ContactPage.jsx"));
const AboutPage = lazy(() => import("../pages/AboutPage.jsx"));
 
const AdminLayout = lazy(
  () => import("../admin/components/AdminLayout/AdminLayout.jsx"),
);
const ProductList = lazy(
  () => import("../admin/pages/Products/ProductList.jsx"),
);
const AddProduct = lazy(() => import("../admin/pages/Products/AddProduct.jsx"));
const Orders = lazy(() => import("../admin/pages/Orders/Orders.jsx"));
const Customers = lazy(() => import("../admin/pages/Customers/Customers.jsx"));
const Banner = lazy(() => import("../admin/pages/banner/banner.jsx"));
const Expenses = lazy(() => import("../admin/pages/Expenses/Expenses.jsx"));
const Coupons = lazy(() => import("../admin/pages/Coupons/Coupons.jsx"));
const PrizePoolList = lazy(
  () => import("../admin/pages/PrizePool/PrizePoolList.jsx"),
);
const CreatePrizePool = lazy(
  () => import("../admin/pages/PrizePool/CreatePrizePool.jsx"),
);
const PrizePoolStats = lazy(
  () => import("../admin/pages/PrizePool/PrizePoolStats.jsx"),
);
const Reports = lazy(() => import("../admin/pages/Reports/Reports.jsx"));
const Settings = lazy(() => import("../admin/pages/Settings/Settings.jsx"));

function App() {
  return (
    <>
      <AuthProvider>
        <AppProvider>
          <Toaster
            containerStyle={{ zIndex: 99999999, top: 20, right: 20 }}
            position="top-right"
          />
          <Router>
            <PWAInstallPrompt />

            <Suspense fallback={<h2>Loading Page...</h2>}>
              <Routes>
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
                <Route path="/about" element={<AboutPage />} />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route path="products" element={<ProductList />} />
                  <Route path="products/add" element={<AddProduct />} />
                  <Route path="products/edit/:id" element={<AddProduct />} />
                  <Route path="orders" element={<Orders />} />
                  <Route path="customers" element={<Customers />} />
                  <Route path="banners" element={<Banner />} />
                  <Route path="expenses" element={<Expenses />} />
                  <Route path="coupons" element={<Coupons />} />
                  <Route path="prize-pools" element={<PrizePoolList />} />
                  <Route
                    path="prize-pools/create"
                    element={<CreatePrizePool />}
                  />
                  <Route
                    path="prize-pools/:id/stats"
                    element={<PrizePoolStats />}
                  />
                  <Route path="reports" element={<Reports />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
              </Routes>
            </Suspense>
          </Router>
        </AppProvider>
      </AuthProvider>
    </>
  );
}

export default App;
 
 
