import React, { useEffect, useState } from "react";
import "./styles.css";
import { axiosInstance } from "../axios";
import OrderHistoryItem from "./OrderHistoryItem";
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
    <div className="order-history">
      <h1>Order History</h1>
      <div className="container">
        {orders.map((ele, ind) => {
          return <OrderHistoryItem ele={ele} key={ind} />;
        })}
      </div>
    </div>
  );
}
