import React, { useEffect } from "react";
import "./styles.css";
import ShopProducts from "./ShopProducts/ShopProducts";
const Homepage = () => {
  useEffect(() => {
    document.title = "Amazon";
  }, []);

  return (
    <>
      <h1 className="homepage-title">Amazon For Customers</h1>
      <ShopProducts />
    </>
  );
};
export default Homepage;
