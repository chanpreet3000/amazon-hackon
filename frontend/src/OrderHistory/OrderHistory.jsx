import React, { useEffect, useState } from "react";
import "./styles.css";
import { axiosInstance } from "../axios";
import OrderHistoryItem from "./OrderHistoryItem";
import ChatBot from "../ChatBot/ChatBot";
export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      await axiosInstance
        .get("/api/customer/orders")
        .then((response) => {
          response.data.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setOrders(response.data.orders);
        })
        .catch((err) => {});
    };

    fetchData();
  }, []);
  return (
    <>
      <ChatBot
        tryName="Try Amazon's New Service Assistant"
        name="Amazon's Service Assistant"
        apiUrl={"/api/query/orderbot"}
        initialMessages={[
          { role: "assistant", message: "Hi! I'm Amazon's new interactive order chat bot." },
          { role: "assistant", message: "How can I help you with your orders today?" },
        ]}
      />
      <div className="order-history">
        <h1>Order History</h1>
        <div className="container">
          {orders.map((ele, ind) => {
            return <OrderHistoryItem ele={ele} key={ind} />;
          })}
        </div>
      </div>
    </>
  );
}
