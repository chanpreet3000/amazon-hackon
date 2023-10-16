import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import CustomerHomepage from "./Homepage/homepage.component";
import CustomerLogin from "./Login/login.component";
import CustomerSignUp from "./Signup/signup.component";
import CustomerNavbar from "./Navbar/navbar.component";
import ShopProducts from "./Homepage/ShopProducts/ShopProducts";
import ProductInfo from "./Homepage/ProductInfo/ProductInfo";
import OrderHistory from "./OrderHistory/OrderHistory";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CustomerNavbar />}>
          <Route index element={<CustomerHomepage />} />
          <Route path="login" element={<CustomerLogin />} />
          <Route path="signup" element={<CustomerSignUp />} />
          <Route path="products" element={<ShopProducts />} />
          <Route path="products/:id" element={<ProductInfo />} />
          <Route path="order_history" element={<OrderHistory />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
export default App;
