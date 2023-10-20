import React, { useEffect } from "react";
import "./styles.css";
import ShopProducts from "./ShopProducts/ShopProducts";
import ChatBot from "../ChatBot/ChatBot";
const Homepage = () => {
  useEffect(() => {
    document.title = "Amazon";
  }, []);

  return (
    <>
      <ChatBot />
      <h1 className="homepage-title">Amazon For Customers</h1>
      <ShopProducts />
    </>
  );
};
export default Homepage;
