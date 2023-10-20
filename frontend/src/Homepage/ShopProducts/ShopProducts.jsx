import React, { useEffect, useState } from "react";
import "./styles.css";
import ProductCard from "./ProductCard/ProductCard";
import { axiosInstance } from "../../axios";

export default function ShopProducts() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      await axiosInstance.get("/api/customer/products").then((response) => {
        setProducts(response.data.products);
      });
    };

    fetchData();
  }, []);
  return (
    <div className="shop-products">
      <h1>Shop Electronics</h1>
      <div className="product-list">
        {products.map((product, ind) => {
          return <ProductCard data={product} key={ind} />;
        })}
      </div>
    </div>
  );
}
