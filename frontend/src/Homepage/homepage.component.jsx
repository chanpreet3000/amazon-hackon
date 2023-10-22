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
      <ChatBot
        tryName="Try Amazon's New Search Assistant"
        name="Amazon's Search Assistant"
        apiUrl={"/api/query/"}
        initialMessages={[
          { role: "assistant", message: "Hi! I'm Amazon's new interactive chat bot." },
          { role: "assistant", message: "How can I help you today?" },
        ]}
      />
      <h1 className="homepage-title">Amazon For Customers</h1>
      <ShopProducts />
    </>
  );
};
export default Homepage;
