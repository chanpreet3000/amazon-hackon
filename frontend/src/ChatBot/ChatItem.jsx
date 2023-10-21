import React from "react";
import ProductCard from "../Homepage/ShopProducts/ProductCard/ProductCard";
import { json } from "react-router-dom";

export default function ChatItem({ data }) {
  return (
    <>
      {data.role === "user" && (
        <>
          <div className="chat-not-system fade-in">
            <img src="https://static.thenounproject.com/png/363633-200.png" />
            <div className="message">{data.message}</div>
          </div>
        </>
      )}
      {data.role === "assistant" && (
        <>
          <div className="chat-system fade-in">
            <img src="https://cdn0.iconfinder.com/data/icons/most-usable-logos/120/Amazon-512.png" />
            <div className="message">{data.message}</div>
          </div>
        </>
      )}

      {data.role === "products-list" && (
        <>
          <div className="product-list">
            {data.message.map((product, ind) => {
              return <ProductCard data={product} key={ind} />;
            })}
          </div>
        </>
      )}
    </>
  );
}
